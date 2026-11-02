import React from 'react';
import ParServicePage from './ParServicePage';
import ArchiveServicePage from './ArchiveServicePage';
import AssetServicePage from './AssetServicePage';
import FinanceServicePage from './FinanceServicePage';
import AttendanceServicePage from './AttendanceServicePage';
import TimelineServicePage from './TimelineServicePage';
import HrServicePage from './HrServicePage';
import HelpdeskServicePage from './HelpdeskServicePage';

const ServiceDispatcher = ({
  serviceId,
  onBackToPortal,
  onBackToLanding,
  onSelectService,
}) => {
  switch (serviceId) {
    case 'par':
    case 'proposal':
      return (
        <ParServicePage
          onBackToPortal={onBackToPortal}
          onBackToLanding={onBackToLanding}
          onSelectService={onSelectService}
        />
      );
    case 'archive':
    case 'arsip':
      return (
        <ArchiveServicePage
          onBackToPortal={onBackToPortal}
          onBackToLanding={onBackToLanding}
          onSelectService={onSelectService}
        />
      );
    case 'asset':
    case 'aset':
      return (
        <AssetServicePage
          onBackToPortal={onBackToPortal}
          onBackToLanding={onBackToLanding}
          onSelectService={onSelectService}
        />
      );
    case 'finance':
    case 'kas':
    case 'reimburse':
      return (
        <FinanceServicePage
          onBackToPortal={onBackToPortal}
          onBackToLanding={onBackToLanding}
          onSelectService={onSelectService}
        />
      );
    case 'attendance':
    case 'meeting':
    case 'presensi':
      return (
        <AttendanceServicePage
          onBackToPortal={onBackToPortal}
          onBackToLanding={onBackToLanding}
          onSelectService={onSelectService}
        />
      );
    case 'timeline':
    case 'calendar':
    case 'jadwal':
      return (
        <TimelineServicePage
          onBackToPortal={onBackToPortal}
          onBackToLanding={onBackToLanding}
          onSelectService={onSelectService}
        />
      );
    case 'hr':
    case 'members':
    case 'sdm':
      return (
        <HrServicePage
          onBackToPortal={onBackToPortal}
          onBackToLanding={onBackToLanding}
          onSelectService={onSelectService}
        />
      );
    case 'helpdesk':
    case 'tiket':
    case 'request':
      return (
        <HelpdeskServicePage
          onBackToPortal={onBackToPortal}
          onBackToLanding={onBackToLanding}
          onSelectService={onSelectService}
        />
      );
    default:
      return (
        <ParServicePage
          onBackToPortal={onBackToPortal}
          onBackToLanding={onBackToLanding}
          onSelectService={onSelectService}
        />
      );
  }
};

export default ServiceDispatcher;

