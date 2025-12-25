import { CONFIG } from '../constants';
import parseSRT from 'parse-srt';

export interface CompileTask {
  task_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message: string;
  video_url: string | null;
  srt_url: string | null;
  code?: string;
}

export interface CompileResponse {
  task_id: string;
  status: 'pending';
  message: string;
  video_url: null;
  srt_url: null;
}

export class CompileService {
  private static readonly COMPILE_ENDPOINT = `${CONFIG.VIDEO_SERVER_URL}/api/compile`;
  private static readonly TASK_ENDPOINT = `${CONFIG.VIDEO_SERVER_URL}/api/tasks`;

  /**
   * 提交编译任务
   * @param content Monaco Editor中的内容
   * @returns 编译任务响应
   */
  static async submitCompileTask(content: string): Promise<CompileResponse> {
    try {
      const response = await fetch(this.COMPILE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: content,
      });

      if (!response.ok) {
        throw new Error(`编译请求失败: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('编译任务提交失败:', error);
      throw error;
    }
  }

  /**
   * 查询任务状态
   * @param taskId 任务ID
   * @returns 任务状态
   */
  static async getTaskStatus(taskId: string): Promise<CompileTask> {
    try {
      const response = await fetch(`${this.TASK_ENDPOINT}/${taskId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`任务查询失败: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('任务状态查询失败:', error);
      throw error;
    }
  }

  /**
   * 根据workspace ID获取任务数据和代码
   * @param workspaceId workspace ID
   * @returns 任务数据，包含code字段
   */
  static async getTaskByWorkspaceId(workspaceId: string): Promise<CompileTask> {
    try {
      const response = await fetch(`${this.TASK_ENDPOINT}/${workspaceId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`获取workspace任务失败: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      // 确保返回的数据包含所需字段
      if (result.video_url && !result.video_url.startsWith('http')) {
        result.video_url = `${CONFIG.VIDEO_SERVER_URL}${result.video_url}`;
      }
      
      if (result.srt_url && !result.srt_url.startsWith('http')) {
        result.srt_url = `${CONFIG.VIDEO_SERVER_URL}${result.srt_url}`;
      }

      return {
        task_id: result.task_id || workspaceId,
        status: result.status || 'completed',
        message: result.message || '',
        video_url: result.video_url || null,
        srt_url: result.srt_url || null,
        code: result.code || ''
      };
    } catch (error) {
      console.error('获取workspace任务失败:', error);
      throw error;
    }
  }

  /**
   * 获取字幕数据
   * @param srtUrl 字幕文件URL
   * @returns 解析后的字幕数据
   */
  static async getSubtitles(srtUrl: string): Promise<import('../types').TranscriptLine[]> {
    try {
      // 如果是相对路径，添加服务器基础URL
      const fullUrl = srtUrl.startsWith('http') ? srtUrl : `${CONFIG.VIDEO_SERVER_URL}${srtUrl}`;
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error(`获取字幕文件失败: ${response.status} ${response.statusText}`);
      }

      const srtContent = await response.text();
      return this.parseSRT(srtContent);
    } catch (error) {
      console.error('获取字幕数据失败:', error);
      throw error;
    }
  }

  /**
   * 解析SRT字幕文件
   * @param srtContent SRT文件内容
   * @returns 解析后的字幕数据
   */
  static parseSRT(srtContent: string): import('../types').TranscriptLine[] {
    try {
      console.log('🔄 开始解析SRT文件，内容长度:', srtContent.length);
      
      // 使用parse-srt库解析SRT内容
      const subtitles = parseSRT(srtContent);
      
      console.log('✅ SRT解析成功，共', subtitles.length, '条字幕');
      
      const result = subtitles.map((subtitle) => ({
        id: `srt_${subtitle.id}`,
        startTime: subtitle.start, // parse-srt已经返回秒数
        endTime: subtitle.end,     // parse-srt已经返回秒数
        text: subtitle.text
      }));
      
      console.log('✅ 字幕数据转换完成:', result.slice(0, 2)); // 只打印前两条作为示例
      
      return result;
    } catch (error) {
      console.error('❌ 解析SRT文件失败:', error);
      throw new Error('SRT文件格式错误或解析失败');
    }
  }

  /**
   * 轮询任务状态直到完成
   * @param taskId 任务ID
   * @param onProgress 进度回调
   * @param maxAttempts 最大尝试次数
   * @param interval 轮询间隔(毫秒)
   * @returns 最终任务状态
   */
  static async pollTaskStatus(
    taskId: string,
    onProgress?: (task: CompileTask) => void,
    maxAttempts: number = 60,
    interval: number = 2000
  ): Promise<CompileTask> {
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        const task = await this.getTaskStatus(taskId);
        
        if (onProgress) {
          onProgress(task);
        }

        if (task.status === 'completed' || task.status === 'failed') {
          return task;
        }

        await new Promise(resolve => setTimeout(resolve, interval));
        attempts++;
      } catch (error) {
        console.error(`轮询任务状态失败 (尝试 ${attempts + 1}/${maxAttempts}):`, error);
        attempts++;
        
        if (attempts >= maxAttempts) {
          throw error;
        }
        
        await new Promise(resolve => setTimeout(resolve, interval));
      }
    }

    throw new Error(`任务轮询超时: ${taskId}`);
  }
}