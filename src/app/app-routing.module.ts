import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { ReportComponent } from './report/report.component';
import { LeadUploadComponent } from './lead-upload/lead-upload.component';
import { LeadsComponent } from './leads/leads.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Role } from './model/user/Role';
import { RoleGuard } from './auth/role.guard';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'changePassword', component: ChangePasswordComponent },
  {
    path: 'lms',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard, RoleGuard],
    data: {
      roles: [Role.KPOAgent, Role.ECManager, Role.Admin]
    },
    children: [
      { path: 'changePassword', component: ChangePasswordComponent }
    ]
  },
  {
    path: 'lms',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard, RoleGuard],
    data: {
      roles: [Role.KPOAgent, Role.ECManager, Role.Admin]
    },
    children: [
      { path: 'dashboard', component: DashboardComponent }
    ]
  },
  {
    path: 'lms',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard, RoleGuard],
    data: {
      roles: [Role.KPOAgent, Role.ECManager, Role.Admin]
    },
    children: [
      { path: 'leads', component: LeadsComponent }
    ]
  },
  {
    path: 'lms',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard, RoleGuard],
    data: {
      roles: [Role.KPOAgent, Role.ECManager, Role.Admin]
    },
    children: [
      { path: 'reports', component: ReportComponent }
    ]
  },
  {
    path: 'lms',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard, RoleGuard],
    data: {
      roles: [Role.Admin]
    },
    children: [
      { path: 'leadUpload', component: LeadUploadComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
