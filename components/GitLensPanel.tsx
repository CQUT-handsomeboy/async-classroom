import React, { useState } from 'react';
import { 
  GitBranch, 
  GitCommit, 
  Clock, 
  User, 
  FileText,
  ChevronDown,
  ChevronRight,
  Search,
  Filter,
  List,
  GitGraph as GitGraphIcon
} from 'lucide-react';
import { Commit } from '../types';
import GitGraph from './GitGraph';

interface GitLensPanelProps {
  commits: Commit[];
}

const GitLensPanel: React.FC<GitLensPanelProps> = ({ commits }) => {
  return <></>
};

export default GitLensPanel;