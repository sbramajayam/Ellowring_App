import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('payroll')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PayrollController {
  @Get('runs')
  @Roles('COMPANY', 'ADMIN')
  runs() {
    return [
      {
        id: 'run-2026-07',
        period: 'Jul 2026',
        employees: 42,
        netPayroll: 1856400,
        status: 'PROCESSED',
        processedAt: new Date().toISOString(),
      },
      {
        id: 'run-2026-08',
        period: 'Aug 2026',
        employees: 42,
        netPayroll: 0,
        status: 'DRAFT',
        processedAt: null,
      },
    ];
  }

  @Get('employees')
  @Roles('COMPANY', 'ADMIN')
  employees() {
    return [
      { id: 'e1', name: 'A. Kumar', netPay: 42800, pf: 1800, esi: 315, status: 'Active' },
      { id: 'e2', name: 'S. Iyer', netPay: 38200, pf: 1650, esi: 285, status: 'Active' },
      { id: 'e3', name: 'R. Menon', netPay: 51000, pf: 2100, esi: 0, status: 'Onboarding' },
    ];
  }

  @Get('statutory')
  @Roles('COMPANY', 'ADMIN')
  statutory() {
    return {
      pfEnabled: true,
      esiEnabled: true,
      ptEnabled: true,
      tdsEnabled: true,
      note: 'Phase-2 payroll statutory configuration (India). Full filing connectors in later hardening.',
    };
  }
}
