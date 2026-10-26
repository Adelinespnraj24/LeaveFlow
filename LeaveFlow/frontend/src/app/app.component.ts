import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { LeaveRequest, LeaveService, LeaveType } from './leave.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="app-shell">
      <header class="topbar">
        <a class="brand" href="#"><span class="brand-mark">L</span><span>LeaveFlow<small>PEOPLE OPERATIONS</small></span></a>
        <div class="top-right"><span class="live-dot"></span> Local demo <span class="avatar">HR</span></div>
      </header>

      <main class="page">
        <section class="welcome">
          <div><p class="eyebrow">WORKPLACE · LEAVE MANAGEMENT</p><h1>Leave requests, made simple.</h1>
          <p class="subheading">Submit time off and keep every request in one clear place.</p></div>
          <div class="date-chip">✦ &nbsp; People first, always</div>
        </section>

        <section class="stats">
          <article class="stat-card"><span class="stat-label">TOTAL REQUESTS</span><strong>{{ requests.length }}</strong><span class="stat-foot">All submitted requests</span><span class="stat-icon purple">▤</span></article>
          <article class="stat-card"><span class="stat-label">PENDING REVIEW</span><strong>{{ count('PENDING') }}</strong><span class="stat-foot">Awaiting a decision</span><span class="stat-icon amber">◷</span></article>
          <article class="stat-card"><span class="stat-label">APPROVED</span><strong>{{ count('APPROVED') }}</strong><span class="stat-foot">Ready for time off</span><span class="stat-icon green">✓</span></article>
          <article class="stat-card"><span class="stat-label">REJECTED</span><strong>{{ count('REJECTED') }}</strong><span class="stat-foot">Requests not approved</span><span class="stat-icon red">×</span></article>
        </section>

        <div class="content-grid">
          <section class="panel form-panel">
            <div class="panel-heading"><div><p class="eyebrow">GET SOME TIME BACK</p><h2>Request leave</h2></div><span class="heading-icon">＋</span></div>
            <p class="panel-copy">Complete the details below to submit your request.</p>
            <form [formGroup]="form" (ngSubmit)="submit()">
              <label>Full name <span>*</span><input formControlName="employeeName" placeholder="e.g. Asha Kumar"></label>
              <label>Work email <span>*</span><input formControlName="employeeEmail" type="email" placeholder="asha@company.com"></label>
              <label>Leave type <span>*</span><select formControlName="leaveType"><option value="CASUAL">Casual leave</option><option value="SICK">Sick leave</option><option value="EARNED">Earned leave</option><option value="OTHER">Other</option></select></label>
              <div class="date-row">
                <label>Start date <span>*</span><input formControlName="startDate" type="date"></label>
                <label>End date <span>*</span><input formControlName="endDate" type="date"></label>
              </div>
              <label>Reason for leave <span>*</span><textarea formControlName="reason" rows="3" maxlength="500" placeholder="Share a short reason..."></textarea></label>
              <p class="form-error" *ngIf="errorMessage">{{ errorMessage }}</p>
              <p class="form-success" *ngIf="successMessage">{{ successMessage }}</p>
              <button class="primary-btn" type="submit" [disabled]="saving">{{ saving ? 'Submitting...' : 'Submit request' }} <span>→</span></button>
              <p class="required-note">* Required fields</p>
            </form>
          </section>

          <section class="panel list-panel">
            <div class="panel-heading list-heading"><div><p class="eyebrow">THE LATEST</p><h2>Leave requests</h2></div><button class="refresh-btn" type="button" (click)="load()">↻ Refresh</button></div>
            <div class="toolbar"><span class="results-count">{{ requests.length }} request{{ requests.length === 1 ? '' : 's' }}</span>
              <select aria-label="Filter by status" [value]="filter" (change)="changeFilter($event)"><option value="ALL">All statuses</option><option value="PENDING">Pending</option><option value="APPROVED">Approved</option><option value="REJECTED">Rejected</option></select>
            </div>
            <p class="form-error" *ngIf="loadError">{{ loadError }}</p>
            <div class="request-list" *ngIf="filteredRequests.length; else emptyState">
              <article class="request-card" *ngFor="let item of filteredRequests">
                <div class="request-top"><div class="person"><span class="person-avatar">{{ initials(item.employeeName) }}</span><div><strong>{{ item.employeeName }}</strong><small>{{ item.employeeEmail }}</small></div></div><span class="status" [ngClass]="item.status.toLowerCase()">{{ pretty(item.status) }}</span></div>
                <div class="request-details"><span class="type-pill">{{ pretty(item.leaveType) }} leave</span><span>▦ &nbsp; {{ formatDate(item.startDate) }} – {{ formatDate(item.endDate) }}</span></div>
                <p class="reason">{{ item.reason }}</p>
                <div class="review-actions" *ngIf="item.status === 'PENDING'"><button class="approve-btn" (click)="review(item, 'APPROVED')" [disabled]="reviewingId === item.id">✓ Approve</button><button class="reject-btn" (click)="review(item, 'REJECTED')" [disabled]="reviewingId === item.id">× Reject</button></div>
              </article>
            </div>
            <ng-template #emptyState><div class="empty-state"><span>▤</span><strong>No requests to show</strong><p>Submit a leave request or choose another filter.</p></div></ng-template>
            <p class="demo-note">Demo note: approval controls represent a manager workflow; authentication is not included in this starter project.</p>
          </section>
        </div>
        <footer>LeaveFlow <span>·</span> A simple way to take care of your people.</footer>
      </main>
    </div>
  `
})
export class AppComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(LeaveService);
  requests: LeaveRequest[] = [];
  filter = 'ALL';
  saving = false;
  reviewingId: number | null = null;
  errorMessage = '';
  successMessage = '';
  loadError = '';

  form = this.fb.nonNullable.group({
    employeeName: ['', [Validators.required, Validators.maxLength(100)]],
    employeeEmail: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    leaveType: ['CASUAL' as LeaveType, Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    reason: ['', [Validators.required, Validators.maxLength(500)]]
  });

  ngOnInit(): void { this.load(); }

  get filteredRequests(): LeaveRequest[] {
    return this.filter === 'ALL' ? this.requests : this.requests.filter(r => r.status === this.filter);
  }

  count(status: string): number { return this.requests.filter(r => r.status === status).length; }

  load(): void {
    this.loadError = '';
    this.service.getAll().subscribe({
      next: data => { this.requests = [...data].sort((a, b) => b.id - a.id); },
      error: () => { this.loadError = 'Cannot connect to the API. Start the Spring Boot backend and check MySQL.'; }
    });
  }

  submit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage = 'Please complete all required fields with a valid email.';
      return;
    }
    const value = this.form.getRawValue();
    if (value.endDate < value.startDate) {
      this.errorMessage = 'End date cannot be earlier than start date.';
      return;
    }
    this.saving = true;
    this.service.create(value).subscribe({
      next: created => {
        this.requests = [created, ...this.requests];
        this.form.reset({ employeeName: '', employeeEmail: '', leaveType: 'CASUAL', startDate: '', endDate: '', reason: '' });
        this.successMessage = 'Your leave request was submitted successfully.';
        this.saving = false;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.error?.message || 'Could not submit the request. Check the backend and try again.';
        this.saving = false;
      }
    });
  }

  review(item: LeaveRequest, status: 'APPROVED' | 'REJECTED'): void {
    this.errorMessage = '';
    this.reviewingId = item.id;
    this.service.updateStatus(item.id, status).subscribe({
      next: updated => {
        this.requests = this.requests.map(r => r.id === updated.id ? updated : r);
        this.reviewingId = null;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.error?.message || 'Unable to update request status.';
        this.reviewingId = null;
      }
    });
  }

  changeFilter(event: Event): void { this.filter = (event.target as HTMLSelectElement).value; }
  initials(name: string): string { return name.split(' ').filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase(); }
  pretty(value: string): string { return value.charAt(0) + value.slice(1).toLowerCase(); }
  formatDate(value: string): string {
    return new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
