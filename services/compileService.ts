import { CONFIG } from '../constants';

export interface CompileTask {
  task_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message: string;
  video_url: string | null;
  srt_url: string | null;
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