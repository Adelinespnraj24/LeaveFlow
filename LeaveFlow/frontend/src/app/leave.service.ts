import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type LeaveType = 'CASUAL' | 'SICK' | 'EARNED' | 'OTHER';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface LeaveRequest {
  id: number;
  employeeName: string;
  employeeEmail: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  createdAt: string;
}

export interface LeaveRequestInput {
  employeeName: string;
  employeeEmail: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
}

@Injectable({ providedIn: 'root' })
export class LeaveService {
  private http = inject(HttpClient);
  private api = 'http://localhost:8080/api/leaves';

  getAll(): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(this.api);
  }

  create(input: LeaveRequestInput): Observable<LeaveRequest> {
    return this.http.post<LeaveRequest>(this.api, input);
  }

  updateStatus(id: number, status: 'APPROVED' | 'REJECTED'): Observable<LeaveRequest> {
    return this.http.patch<LeaveRequest>(`${this.api}/${id}/status`, { status });
  }
}
