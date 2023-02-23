const SyslogServerList = () =>
  import(
    /* webpackChunkName: "org-security" */ "@/components/syslog/syslog-server/list"
  );
const SyslogServerDetail = () =>
  import(
    /* webpackChunkName: "org-security" */ "@/components/syslog/syslog-server/detail"
  );

export default [
  {
    path: 'logs/syslog-servers',
    name: "SyslogServerList",
    component: SyslogServerList,
    meta: {
      descriptiveName: "Syslog Servers Listing",
    },
  },
  {
    path: "logs/syslog-servers/new",
    name: "NewSyslogServer",
    component: SyslogServerDetail,
    meta: {
      title: "Launch Syslog Server",
      descriptiveName: "Syslog Server Detail",
    },
  },
  {
    path: "logs/syslog-servers/:syslogServerId",
    name: "SyslogServerDetail",
    component: SyslogServerDetail,
    props: (route) => ({
      syslogServerId: route.params.syslogServerId,
    }),
    meta: {
      title: "Server Details",
      descriptiveName: "Syslog Server Detail",
    },
  },
];
