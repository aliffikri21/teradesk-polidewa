import React from 'react';
import ParServicePage from './ParServicePage';
import ArchiveServicePage from './ArchiveServicePage';
import AssetServicePage from './AssetServicePage';
import FinanceServicePage from './FinanceServicePage';
import AttendanceServicePage from './AttendanceServicePage';
import TimelineServicePage from './TimelineServicePage';
import HrServicePage from './HrServicePage';
import HelpdeskServicePage from './HelpdeskServicePage';
import HumasServicePage from './HumasServicePage';
import KkmServicePage from './KkmServicePage';
import ActivityArchiveServicePage from './ActivityArchiveServicePage';

const ServiceDispatcher = ({
  serviceId,
  onBackToPortal,
  onBackToLanding,
  onSelectService,
  authUser,
  onLogout,
  prokerList = [],
  onAddProker,
  onUpdateProker,
  onDeleteProker,
  accounts = [],
  onAddAccount,
  onAddActivityLog,
  tickets = [],
  onAddTicket,
  onUpdateTicketStatus,
}) => {
  const commonProps = {
    onBackToPortal,
    onBackToLanding,
    onSelectService,
    authUser,
    onLogout,
    prokerList,
    onAddProker,
    onUpdateProker,
    onDeleteProker,
    accounts,
    onAddAccount,
    onAddActivityLog,
    tickets,
    onAddTicket,
    onUpdateTicketStatus,
  };

  switch (serviceId) {
    case 'par':
    case 'proposal':
      return <ParServicePage {...commonProps} />;
    case 'archive':
    case 'arsip':
      return <ArchiveServicePage {...commonProps} />;
    case 'asset':
    case 'aset':
      return <AssetServicePage {...commonProps} />;
    case 'finance':
    case 'kas':
    case 'reimburse':
      return <FinanceServicePage {...commonProps} />;
    case 'attendance':
    case 'meeting':
    case 'presensi':
      return <AttendanceServicePage {...commonProps} />;
    case 'timeline':
    case 'calendar':
    case 'jadwal':
      return <TimelineServicePage {...commonProps} />;
    case 'hr':
    case 'members':
    case 'sdm':
      return <HrServicePage {...commonProps} />;
    case 'helpdesk':
    case 'tiket':
    case 'request':
      return <HelpdeskServicePage {...commonProps} />;
    case 'humas':
    case 'medpart':
    case 'relasi':
      return <HumasServicePage {...commonProps} />;
    case 'kkm':
    case 'merch':
    case 'usaha':
      return <KkmServicePage {...commonProps} />;
    case 'activity':
    case 'kegiatan':
    case 'arsip-kegiatan':
      return <ActivityArchiveServicePage {...commonProps} />;
    default:
      return <ParServicePage {...commonProps} />;
  }
};

export default ServiceDispatcher;
