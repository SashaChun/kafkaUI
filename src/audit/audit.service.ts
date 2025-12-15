import { Injectable } from '@nestjs/common';

interface AuditEntry {
  action: string;
  actor: string;
  timestamp: string;
  payload?: any;
}

@Injectable()
export class AuditService {
  private logs: AuditEntry[] = [];

  push(entry: AuditEntry) {
    this.logs.push({ ...entry, timestamp: new Date().toISOString() });
  }

  list() {
    return this.logs;
  }
}
