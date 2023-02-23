
export const getEmptyL7FirewallRule = () => {
  return {
    policy: 'deny',
    type: '',
    value: ''
  }
}

export const getEmptyScheduleDetail = () => {
  return {
    active: true,
    from: '00:00',
    to: '24:00'
  }
}

export const getEmptySchedulingSettings = () => {
  const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const schedule = {
    enabled: false
  }

  weekdays.forEach(weekday => {
    schedule[weekday] = getEmptyScheduleDetail()
  })

  return schedule
}

export const getEmptySwitchPortSchedule = () => {
  const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const schedule = {
    name: '',
    portSchedule: {}
  }

  weekdays.forEach(weekday => {
    schedule.portSchedule[weekday] = getEmptyScheduleDetail()
  })

  return schedule
}

export const getEmptyGroupPolicy = () => {
  return {
    name: '',
    scheduling: getEmptySchedulingSettings(),
    bandwidth: {
      settings: 'network default',
      bandwidthLimits: {
        limitUp: null,
        limitDown: null
      }
    },
    firewallAndTrafficShaping: {
      settings: 'network default',
      l3FirewallRules: [],
      l7FirewallRules: [],
      trafficShapingRules: []
    },
    splashAuthSettings: 'network default',
    vlanTagging: {
      settings: 'network default'
    },
    bonjourForwarding: {
      settings: 'network default',
      rules: []
    }
  }
}

export const getEmptySwitchQOSRule = () => {
  return {
    policy: null,
    protocol: null,
    srcPort: null,
    dstPort: null,
    vlan: null,
    dscp: 0
  }
}

export const getEmptyMxOneToOneNatRule = () => {
  return {
    name: '',
    publicIp: '',
    lanIp: '',
    uplink: 'internet1',
    allowedInbound: []
  }
}

export const getEmptySwitchProfilePort = () => {
  return {
    name: '',
    type: 'trunk',
    udld: 'Alert only',
    vlan: 1,
    allowedVlans: 'all',
    portId: '',
    enabled: true,
    stpGuard: 'disabled',
    poeEnabled: true,
    rstpEnabled: true,
    linkNegotiation: 'Auto negotiate',
    isolationEnabled: false,
    tags: []
  }
}

export const getEmptySwitchProfile = () => {
  return {
    name: '',
    switch_model: null,
    ports: [],
    placeholderPort: null
  }
}

export const getEmptyWirelessRfProfile = () => {
  return {
    name: '',
    bandSelectionType: 'ap',
    apBandSettings: {
      bandOperationMode: 'dual',
      bandSteeringEnabled: false
    },
    clientBalancingEnabled: false,
    minBitrateType: 'band',
    fiveGhzSettings: {
      channelWidth: 'auto',
      maxPower: 30,
      minBitrate: 12,
      minPower: 8,
      rxsop: null,
      validAutoChannels: [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112, 116, 120,
        124, 128, 132, 136, 140, 144, 149, 153, 157, 161, 165]
    },
    twoFourGhzSettings: {
      axEnabled: true,
      maxPower: 30,
      minBitrate: 11,
      minPower: 5,
      rxsop: null,
      validAutoChannels: [1, 6, 11]
    }
  }
}

export const getEmptySSID = () => {
  return {
    definition: {
      name: '',
      enabled: true,
      authMode: 'open',
      splashPage: 'None'
    },
    traffic_shaping_settings: {},
    mr_l3_firewall_rules: null,
    splash_page_settings: {}
  }
}
