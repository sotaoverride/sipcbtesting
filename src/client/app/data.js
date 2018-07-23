
var callCodecs = {
    "1": 'G.722',
    "2": 'G.711 µ-law (PCMU)',
    "3": 'G.711 A-law (PCMA)',
    "4": 'G.726',
    "5": 'G.729'
};
var diag = {
    forms: [
      {
        title: "DSP Status",
        type: 'form',
        info: 'This command will cause the DSP to report status in the support logs. After issuing this command, click <a href="/tools/logs">HERE</a> to download the logs from the Tools > Logs page.',
        cmd: 'dsp.dump'
      }, {
        title: "Command",
        type: 'input',
        cmd: 'dsp.web-cmd'
      }
    ]
};
var tools = {
  'update': {
    menu: 'Update',
    forms: [
      {
        submitLabel: 'Update firmware',
        input: {
          'bundle': {
            type: 'file',
            accept: [/.+\.\d+$/, /.+\.bundle$/, /.+\.img$/],
            info: 'Firmware file should be named *.img. Please contact Revolabs for firmware file or assistance with updating if needed.',
            reqType: 'uploadFirmware'
          }
        }
      }
    ]
  },
  'contacts': {
    menu: 'Contacts',
    show: 'sys.voip-capable',
    forms: [
      {
        submitLabel: 'Export Contacts',
        input: {
          'export': {
            type: 'form',
            reqType: 'exportContacts',
            info: 'Export saved contacts to a CSV file. The exported file can be imported to other devices or applications, or it can be used to edit contact details. To update edited contacts, use the import function below. NOTE: Contacts can be updated and added via import; however, to delete a contact you must use the dialer.'
          }
        }
      }, {
        submitLabel: 'Import Contacts',
        input: {
          'import': {
            type: 'file',
            label: 'Upload Contacts',
            accept: /.+\.csv$/,
            info: 'Contacts file must be a CSV file.',
            reqType: 'importContacts'
          }
        }
      }
    ]
  },
  'config': {
    menu: 'Configuration',
    forms: [
      {
        submitLabel: 'Export Configuration',
        input: {
          'config': {
            type: 'form',
            info: 'Export device configuration to an XML file. This will export all settings except the system password and the SIP password.',
            reqType: 'exportConfig'
          }
        }
      }, {
        submitLabel: 'Import Configuration',
        input: {
          'import': {
            type: 'file',
            accept: /.+\.xml$/,
            info: 'Configuration file must be an XML file that was exported from another device.',
            reqType: 'importConfig'
          }
        }
      }, {
        submitLabel: 'Reset Defaults',
        info: 'Select which values to reset.',
        input: {
          'sys.reset-setting': {
            type: 'array',
            values: {
              'voip': 'SIP settings',
              'contacts': 'Contacts',
              'recents': 'Call history',
              'audio': 'Audio settings',
              'network': 'Network settings',
              'camera': 'Camera settings',
              'bluetooth': 'Bluetooth settings',
              'all': 'Restore ALL defaults'
            }
          }
        }
      }
    ]
  },
  'logs': {
    menu: 'Logs',
    forms: [
      {
        submitLabel: 'Download Logs',
        input: {
          'logs': {
            type: 'form',
            info: 'Download support logs if requested by Revolabs technical support. Enable verbose logging below if needed.',
            reqType: 'requestSupportLog'
          }
        }
      }, {
        submitLabel: 'Submit',
        title: false,
        input: {
          'sys.verbose-log-enabled': {
            type: 'checkbox',
            label: 'Enable verbose logging'
          }
        }
      }
    ]
  },
  'dot1x': {
    forms: [
      {
        submitLabel: 'Upload certificate',
        input: {
          'cert': {
            type: 'file',
            accept: [/.+\.pem$/, /.+\.der$/, /.+\.cet$/, /.+\.crt$/],
            info: 'Certificate file should be named *.pem, *.der, *.crt, or *.cer. Please contact Revolabs for assistance with if needed.',
            reqType: 'uploadDot1xCert'
          }
        }
      }
    ]
  }
};

var formData = [
    {
        // Admin
        name: 'sys.md5-password',
        section: 'admin',
        label: 'System password',
        defaultVal: '7386',
        type: 'password',
        hash: 1,
        pattern: /^(\d{4,64})$/,
        info: 'The password is used to control access to the web interface and the advanced Administrator settings on the device. The password may only contain digits, and must be at least 4 characters, but less than 65 characters. The default password is 7386. This password should be changed by the system administrator. Please ensure that you take note of the changed password.'
    },

    {
        name: 'sys.systemname',
        section: 'admin',
        label: 'System name',
        type: 'text',
        info: 'Specifies the system name. By default, this is set to the device\'s MAC address.'
    }, {
        name: 'sys.recent-call-enabled',
        section: 'admin',
        field: 'Security',
        label: 'Enable call history',
        defaultVal: 1,
        type: 'checkbox',
        cb: 'recents',
        info: 'Use this option to enable or disable the call history list. By default this is enabled.'
    // }, {
    //     name: 'sys.web-enabled',
    //     section: 'admin',
    //     field: 'Security',
    //     label: 'Enable web access',
    //     type: 'checkbox',
    //     cb: 'webAccess',
    //     info: 'Use the Web Access Enabled option to enable or disable access to this application. Even if enabled, the web interface is password protected for all pages. It is restricted to Administrator use. If disabled, any web access is rejected. Once web access is disabled, it can only be enabled again by an administrator from the device. The default setting is On.'
    }, {
        name: 'sys.require-https',
        section: 'admin',
        field: 'Security',
        label: 'Require HTTPS',
        type: 'checkbox',
        defaultVal: 0,
        // cb: 'https',
        info: 'Use the Require HTTPS option to enable or disable the HTTPS-only device web application. When set to on, the web application is only accessible via HTTPS, which ensures all web traffic is encrypted by full 256-bit AES encryption end-to-end. NOTE: When accessing the HTTPS web application, the browser may show a security warning, which must be bypassed. To disable the security warning, this must be set to Off. When set to Off, the web application is accessible using HTTP, which is insecure and does not provide any encryption of web traffic. The default setting is Off.'
    // }, {
    //     name: 'sys.upgrade-mode',
    //     section: 'admin',
    //     label: 'Upgrade mode',
    //     type: 'select',
    //     values: [{
    //         'val': 'usb',
    //         'label': 'USB only'
    //     }, {
    //         'val': 'ip',
    //         'label': 'IP only'
    //     }, {
    //         'val': 'all',
    //         'label': 'USB or IP'
    //     }],
    //     defaultVal: 'all',
    //     info: 'Specifies the type of upgrade that is supported. By default, this is set to "USB or IP".'
    }, {
        name: 'sys.ui-mask',
        section: 'admin',
        field: 'Dialer Restrictions',
        type: 'addCheckbox',
        values: {
            '8': 'Disable call history modification',
            '16': 'Disable contacts modification',
            '32': 'Disable Do not Disturb (DnD) setting'
        },
        info: 'Use this option to disable this feature in the dialer UI. Changes can only be made from the web UI. To fully restrict user access, disable web access as well. By default this is unchecked.'
    }, {
        name: 'sys.enable-telnet',
        section: 'admin',
        field: 'Security',
        label: 'Enable telnet access',
        type: 'checkbox',
        cb: 'reboot',
        info: 'Enable telnet access to the device. Changing this setting requires a device reboot. By default, this is disabled.'
    }, {
        name: 'sys.telnet-password',
        section: 'admin',
        field: 'Security',
        label: 'Telnet password',
        type: 'telnet-password',
        info: 'The password is used with roomcontrol',
        show: 'sys.enable-telnet'
    }, 
    //{
    //    name: 'sys.dialer-connection-mode',
    //    section: 'admin',
    //    label: 'Enable BLE dialer',
    //    type: 'checkbox',
    //    defaultVal: 1,
    //    info: 'Enable BLE (Bluetooth Low Energy) tablet/dialer connection mode to the base. The dialer can only be connected via BLE when enabled, otherwise it must be connected via USB if disabled. By default, this is enabled.',
    //    show: 'sys.voip-capable'
    // }, {
    //     name: 'sys.aux-usb-port-mode',
    //     section: 'admin',
    //     field: 'Auxiliary USB',
    //     label: 'USB mode',
    //     type: 'select',
    //     values: [{
    //         'val': 0,
    //         'label': 'USB Hub'
    //     }, {
    //         'val': 1,
    //         'label': 'IP to Auxiliary'
    //     }, {
    //         'val': 2,
    //         'label': 'OTG'
    //     }],
    //     info: 'Specifies the configuration of the aux USB port. 0: USB Hub, 1: IP to Aux, 2: OTG. By default, this is set to USB Hub.'
    // }, {
    //     name: 'sys.aux-usb-ip',
    //     section: 'admin',
    //     field: 'Auxiliary USB',
    //     label: 'USB IP',
    //     type: 'ipAddress',
    //     subOpt: {
    //         id: 'sys.aux-usb-port-mode',
    //         val: 1
    //     },
    //     info: 'The IP address of the USB interface exposed from the USB aux port.'
    // }, {
    //     name: 'sys.aux-usb-subnet',
    //     section: 'admin',
    //     field: 'Auxiliary USB',
    //     label: 'USB subnet',
    //     type: 'ipAddress',
    //     subOpt: {
    //         id: 'sys.aux-usb-port-mode',
    //         val: 1
    //     },
    //     info: 'The IP subnet address of the USB interface exposed from the USB aux port.'
    //}, 
    {
        name: 'sys.enable-btn-camera',
        section: 'admin',
        field: 'Front Panel',
        label: 'Enable camera button',
        type: 'checkbox',
        info: 'Enable/disable camera button on the front panel. By default, this is is enabled.'
    }, {
        name: 'sys.enable-btn-audio',
        section: 'admin',
        field: 'Front Panel',
        label: 'Enable audio button',
        type: 'checkbox',
        info: 'Enable/disable audio button on the front panel. By default, this is is enabled.'
    }, {
        name: 'sys.enable-btn-volume',
        section: 'admin',
        field: 'Front Panel',
        label: 'Enable volume buttons',
        type: 'checkbox',
        info: 'Enable/disable volume buttons on the front panel. By default, this is is enabled.'
    }, {
        name: 'sys.enable-btn-bluetooth',
        section: 'admin',
        field: 'Front Panel',
        label: 'Enable bluetooth button',
        type: 'checkbox',
        info: 'Enable/disable bluetooth button on the front panel. By default, this is is enabled.'
    }, {
        name: 'sys.enable-led-call',
        section: 'admin',
        field: 'Front Panel',
        label: 'Enable call light',
        type: 'checkbox',
        info: 'Enable/disable call status LED on the front panel. By default, this is is enabled.'
    }, {
        name: 'sys.power-saving-mode',
        section: 'admin',
        field: 'Power Saving',
        label: 'Enable power saving mode',
        type: 'checkbox',
        info: 'Enable/disable power saving mode setting. By default, this is is enabled.'
    }, {
    //     name: 'sys.power-saving-components',
    //     section: 'admin',
    //     field: 'Power Saving',
    //     label: 'Components',
    //     type: 'text',
    //     show: 'sys.power-saving-mode',
    //     info: 'Configure components for power saving mode setting.'
    // }, {
        name: 'sys.power-saving-time',
        section: 'admin',
        field: 'Power Saving',
        label: 'Timeout (minutes)',
        type: 'number',
        defaultVal: 20,
        show: 'sys.power-saving-mode',
        info: 'Configure power saving timeout in minutes. After this period elapses with no usage, the device will enter power saving mode. By default, this is is set to 20 minutes.'
    }, {
        name: 'sys.snmp-enable',
        section: 'admin',
        field: 'SNMP',
        label: 'Enable SNMP',
        type: 'checkbox',
        // values: [{
        //     'val': 0,
        //     'label': 'Disabled'
        // }, {
        //     'val': 1,
        //     'label': 'Enabled'
        // }, {
        //     'val': 2,
        //     'label': 'Automatic'
        // }],
        info: 'Specifies SNMP access for the device. Disabled: the SNMP agent on the device is not running. Enabled: SNMP is available and the snmp-server property indicates the SNMP server address. By default, this is is set to Disabled.',
        cb: 'net'
    }, {
        name: 'sys.snmp-address',
        section: 'admin',
        field: 'SNMP',
        label: 'Server address',
        type: 'ipAddress',
        subOpt: {
            id: 'sys.snmp-enable',
            val: 1
        },
        info: 'Specifies SNMP server IP address when SNMP is set to enabled. Port 162 needs to be open on the server to get traps.',
        cb: 'net'
    }, {
        name: 'sys.snmp-community',
        section: 'admin',
        field: 'SNMP',
        label: 'Read-only community',
        type: 'text',
        subOpt: {
            id: 'sys.snmp-enable',
            val: 1
        },
        info: 'Specifies SNMP read-only community string when SNMP is set to enabled.',
        cb: 'net'
    }, {
        name: 'sys.snmp-device-location',
        section: 'admin',
        field: 'SNMP',
        label: 'Device location',
        type: 'text',
        subOpt: {
            id: 'sys.snmp-enable',
            val: 1
        },
        info: 'Specifies SNMP device location when SNMP is set to enabled.',
        cb: 'net'
    }, {
        name: 'sys.snmp-contact-name',
        section: 'admin',
        field: 'SNMP',
        label: 'Contact name',
        type: 'text',
        subOpt: {
            id: 'sys.snmp-enable',
            val: 1
        },
        info: 'Specifies SNMP contact name when SNMP is set to enabled.',
        cb: 'net'
    }, {
        name: 'sys.enable-deploy',
        section: 'admin',
        field: 'Deployment Server',
        label: 'Enable deployment server',
        type: 'checkbox',
        info: 'When enabled, the system can be configured to use a deployment server. By default this is enabled.'
    }, {
        name: 'sys.auto-deploy',
        section: 'admin',
        field: 'Deployment Server',
        label: 'Enable automatic server discovery',
        type: 'checkbox',
        show: 'sys.enable-deploy',
        info: 'When enabled, the system can be configured to automatically detect a deployment server via DHCP option 66 or the administrator can manually specify a deployment server address. By default this is enabled.'
    }, {
        name: 'sys.provisioning-interval',
        section: 'admin',
        field: 'Deployment Server',
        label: 'Provisioning interval (minutes)',
        defaultVal: 1440,
        type: 'range',
        max: 44640,
        min: 1,
        show: 'sys.enable-deploy',
        info: 'Specify the provisioning interval for the device, in minutes. The default value is 1,440 (1 day), and the maximum interval is 44,640 (31 days).'
    }, {
        name: 'sys.ftp-srv1',
        section: 'admin',
        field: 'Deployment Server',
        label: 'Primary server',
        // type: 'ipAddress',
        pattern: /^((https?|ftp):\/\/)?[^\s/$.?#].[^\s]*$/,
        patternMsg: 'Please enter a valid IP address or domain name.',
        placeholder: 'IP Address',
        subOpt: {
            parent: 'sys.enable-deploy',
            id: 'sys.auto-deploy',
            val: 0
        },
        required: 1,
        info: 'If the deployment server is enabled but auto discovery is disabled, the administrator must manually specify a deployment server address. The primary server is required.'
    }, {
        name: 'sys.ftp-srv2',
        section: 'admin',
        field: 'Deployment Server',
        label: 'Secondary server',
        // type: 'ipAddress',
        pattern: /^((https?|ftp):\/\/)?[^\s/$.?#].[^\s]*$/,
        patternMsg: 'Please enter a valid IP address or domain name.',
        placeholder: 'IP Address',
        subOpt: {
            parent: 'sys.enable-deploy',
            id: 'sys.auto-deploy',
            val: 0
        },
        info: 'If the deployment server is enabled but auto discovery is disabled, the administrator must manually specify a deployment server address. The secondary server is optional.'
    }, {
        // Audio
        name: 'audio.analog-audio-in-mode',
        section: 'audio',
        field: 'TV Audio-In',
        label: 'Enable manual gain',
        type: 'checkbox',
        defaultVal: 0,
        info: 'Enable/disable manual gain for the TV audio in port. When disabled, gain is automatically determined, and when enabled, the gain value must be manually specified. By default, this is disabled.'
    }, {
        name: 'audio.analog-audio-in-gain',
        section: 'audio',
        field: 'TV Audio-In',
        label: 'Manual gain',
        type: 'range',
        min: -12,
        max: 40,
        step: 0.5,
        defaultVal: 4.5,
        show: 'audio.analog-audio-in-mode',
        info: 'For the TV audio in port, specify the manual gain setting in dB. By default, this is set to 4.5dB.'
    }, {
    //     name: 'audio.voice-pick-up-angle-left',
    //     section: 'audio',
    //     label: 'Left voice pick-up angle',
    //     type: 'range',
    //     min: -90,
    //     max: 90,
    //     defaultVal: 0,
    //     info: 'The left-side voice pick-up angle in degrees. By default, this is set to 0.'
    // }, {
    //     name: 'audio.voice-pick-up-angle-right',
    //     section: 'audio',
    //     label: 'Right voice pick-up angle',
    //     type: 'range',
    //     min: -90,
    //     max: 90,
    //     defaultVal: 0,
    //     info: 'The right-side voice pick-up angle in degrees. By default, this is set to 0.'
    // }, {
        name: 'voip.codec',
        section: 'audio',
        field: 'Media',
        label: 'Audio codec',
        type: 'sortable',
        lists: [{
            name: 'Enabled',
            req: 1
        }, {
            name: 'Disabled'
        }],
        values: callCodecs,
        cb: 'sip',
        info: 'Drag and drop to sort audio codecs by priority. There must be at least one codec supported. The default supported codec priority are: G.722, G.711 µ-law (PCMU), G.711 A-law (PCMA), G.726, and G.729. If fewer codecs are desired, drag the unused codecs into \'Disabled\'.',
        show: 'sys.voip-capable'
    }, {
        name: 'voip.ptime',
        section: 'audio',
        field: 'Media',
        label: 'Codec ptime override (ms)',
        defaultVal: 20,
        type: 'range',
        min: 10,
        max: 60,
        step: 10,
        cb: 'sip',
        info: 'The ptime (packetization interval) value for a codec determines the length of time in milliseconds represented by the media in an RTP packet which is used to transmit audio traffic. The valid range is 10-60 in 10 ms increments. For all of the codecs supported by the device, the default ptime value is 20 ms/packet.',
        show: 'sys.voip-capable'
    }, {
        name: 'audio.eq',
        section: 'audio',
        label: 'Equalizer',
        type: 'select',
        values: [{
            'val': 1,
            'label': 'Voice Enhance'
        }, {
            'val': 2,
            'label': 'Bass Boost'
        }, {
            'val': 3,
            'label': 'Treble Boost'
        }],
        info: 'Adjust the speaker frequency response to your preference for the room and the types of calls. Voice Enhance is the default value.'
    }, {
        name: 'audio.high-pass-filter',
        section: 'audio',
        label: 'High pass filter',
        type: 'select',
        values: [{
            'val': 0,
            'label': 'None'
        }, {
            'val': 1,
            'label': '110 Hz'
        }, {
            'val': 2,
            'label': '140 Hz'
        }, {
            'val': 3,
            'label': '175 Hz'
        }, {
            'val': 4,
            'label': '225 Hz'
        }],
        info: 'High pass filters are provided to adjust the microphones frequency response to room and application requirements. Use the High-Pass filter in rooms that have a high background noise in the low frequencies (air conditioning, lighting fixtures, etc.). All filters are biquad filters, reducing the signal by 6dB per octave. By default this is disabled.'
    }, {
        // Bluetooth
        name: 'bt.bt-enable',
        section: 'bluetooth',
        label: 'Enable Bluetooth',
        type: 'checkbox',
        info: 'Enable or disable Bluetooth basic-rate.',
        cb: 'bt'
    }, {
        name: 'bt.nfc-enable',
        section: 'bluetooth',
        label: 'Enable NFC',
        type: 'checkbox',
        info: 'Enable/disable NFC and NFC Logo LED on the front panel. By default, this is is enabled.',
        show: 'bt.bt-enable',
        cb: 'bt'
    }, {
        name: 'bt.bt-name',
        section: 'bluetooth',
        label: 'Device name',
        type: 'text',
        show: 'bt.bt-enable',
        info: 'The Bluetooth basic-rate device name advertised over the air. By default, this is set to the product name (Yamaha CS-700) followed by the device\'s MAC address.'
    }, {
        name: 'bt.bt-pin',
        section: 'bluetooth',
        label: 'Pairing pin',
        type: 'text',
        pattern: /^(\d{4})?$/,
        patternMsg: 'Please enter exactly 4 digits.',
        defaultVal: '0000',
        show: 'bt.bt-enable',
        info: 'The Bluetooth basic-rate pin for pairing. Pins must be exactly 4 digits. An empty field indicates that no PIN is required. By default, the PIN is set to 0000.',
        cb: 'bt'
    }, {
        name: 'bt.bt-pair-timeout',
        section: 'bluetooth',
        label: 'Pairing and connection timeout (seconds)',
        type: 'range',
        min: 0,
        max: 120,
        step: 30,
        defaultVal: 60,
        show: 'bt.bt-enable',
        info: 'Bluetooth basic-rate pairing and connecting timeout in seconds. After this time, the pairing and connecting modes will stop. A value of 0 indicates no timeout. By default, this is set to 60 seconds.',
        cb: 'bt'
    }, {
    //     name: 'bt.bt-connect-timeout',
    //     section: 'bluetooth',
    //     label: 'Connection timeout (minutes)',
    //     type: 'number',
    //     defaultVal: 0,
    //     max: 10080,
    //     info: 'Bluetooth basic-rate connection timeout. After this time, a connected Bluetooth device will be disconnected. A value of 0 means never timeout, and the maximum is 10,080, or 1 week. By default, this is set to 0.',
    //     cb: 'bt'
    // }, {
    //     name: 'bt.bt-autoconnect',
    //     section: 'bluetooth',
    //     label: 'Enable auto-connect',
    //     type: 'checkbox',
    //     defaultVal: 1,
    //     info: 'Auto-connect to a paired Bluetooth basic-rate device when that device is in range. By default, this is enabled.',
    //     cb: 'bt'
    // }, {
        name: 'ble.ble-advertise',
        section: 'bluetooth',
        field: 'Wireless Dialer',
        label: 'Enable wireless dialer',
        type: 'checkbox',
        defaultVal: true,
        info: 'Enable or disable wireless dialer. By default, this is disabled.'
        
    }, {
        // Camera
   
        name: 'cam.camera-ptz',
        section: 'camera',
        label: 'Active PTZ position',
        type: 'multiNumber',
        dataType: 'int',
        values: [{
            label: 'Pan',
            name: 'cam.camera-pan',
        }, {
            label: 'Tilt',
            name: 'cam.camera-tilt',
        }, {
            label: 'Zoom',
            name: 'cam.camera-zoom',
        }],
        info: 'Active digital PTZ (Pan/Tilt/Zoom) positions for live camera stream. Pan and Tilt are available only when camera is zoomed in, and both revert to 0 when zoom is set to 1. By default, Pan and Tilt are set to 0 and Zoom is set to 1.'
    }, {
        name: 'cam.cam-save-as-default',
        section: 'camera',
        label: 'Set PTZ Home to active position',
        type: 'btn',
        info: 'Save the current PTZ position as the default values (PTZ home).'
    }, {
        name: 'cam.camera-ptz-home',
        section: 'camera',
        label: 'PTZ home position',
        type: 'multiNumber',
        dataType: 'array',
        values: [{
            label: 'Pan',
            min: -30,
            max: 30
        }, {
            label: 'Tilt',
            min: -18,
            max: 18
        }, {
            label: 'Zoom',
            min: 1,
            max: 22
        }],
        info: 'Default PTZ (Pan/Tilt/Zoom) settings for home position. When the device detects that the upstream USB connection has been established, either at startup or after a USB disconnection, it will revert to the default PTZ settings. By default, Pan and Tilt are set to 0 and Zoom is set to 1.'
    }, {
        name: 'cam.cam-apply-defaults',
        section: 'camera',
        label: 'Return to PTZ Home',
        type: 'btn',
        info: 'Apply the saved PTZ Home settings. These settings are also automatically applied when the device detects that the upstream USB connection has been established, either at startup or after a USB disconnection.'
    }, {
        name: 'cam.camera-image',
        section: 'camera',
        label: 'Active image settings',
        type: 'multiNumber',
        dataType: 'int',
        values: [{
            label: 'Backlight',
            name: 'cam.camera-backlight',
        }, {
            label: 'Brightness',
            name: 'cam.camera-brightness',
        }, {
            label: 'Contrast',
            name: 'cam.camera-contrast',
        }, {
            label: 'Saturation',
            name: 'cam.camera-saturation',
        }, {
            label: 'Sharpness',
            name: 'cam.camera-sharpness',
        }, {
            label: 'Hue',
            name: 'cam.camera-hue',
        }, {
            label: 'Gamma',
            name: 'cam.camera-gamma',
        }],
        info: 'Active image settings (Backlight/Brightness/Contrast/Saturation/Sharpness/Hue/Gamma) settings for live camera stream.'
    }, {
        name: 'cam.cam-image-save-as-default',
        section: 'camera',
        label: 'Set image settings to active',
        type: 'btn',
        info: 'Save the current image settings as the default values.'
    }, {
        name: 'cam.camera-image-defaults',
        section: 'camera',
        label: 'Camera Image settings',
        type: 'multiNumber',
        dataType: 'array',
        values: [{
            label: 'Backlight',
            min: -10,
            max: 300
        }, {
            label: 'Brightness',
            min: -10,
            max: 300
        }, {
            label: 'Contrast',
            min: -10,
            max: 300
        }, {
            label: 'Saturation',
            min: -10,
            max: 300
        }, {
            label: 'Sharpness',
            min: -10,
            max: 300
        }, {
            label: 'Hue',
            min: -10,
            max: 300
        }, {
            label: 'Gamma',
            min: -10,
            max: 300
        }],
        info: 'Default  (Backlight/Brightness/Contrast/Saturation/Sharpness/Hue/Gamma) settings for image.'
    }, {
        name: 'cam.cam-image-apply-defaults',
        section: 'camera',
        label: 'Return to default image settings',
        type: 'btn',
        info: 'Apply the saved image default settings. These settings are also automatically applied when the device detects that the upstream USB connection has been established, either at startup or after a USB disconnection.'
    }, {
        name: 'cam.camera-flicker',
        section: 'camera',
        label: 'Power Line Frequency for Anti-Flicker',
        dataType: 'int',
        defaultVal: 2,
        type: 'select',
        values: [{
            'val': 1,
            'label': '50Hz'
        }, {
            'val': 2,
            'label': '60Hz'
        }],
        info: 'Adjust anti-flicker according to your power line frequency.'
    }, {  //calls
        name: 'voip.mwi',
        section: 'calls',
        label: 'Enable message waiting indication',
        type: 'checkbox',
        cb: 'sip',
        info: 'Select this option to display the message waiting indicator (MWI) on the Dialer and to enable message waiting notifications from the PBX. The PBX must be configured to support voice mail for the registered user in order for this feature to work properly. This is unchecked by default.'
    }, {
        name: 'voip.do-not-disturb',
        section: 'calls',
        label: 'Set Do not Disturb (DnD) mode',
        type: 'checkbox',
        subOptHide: {
            id: 'sys.ui-mask',
            val: 32
        },
        info: 'This will put the device in Do not Disturb mode. By default this is disabled.'
    }, {
        name: 'voip.auto-answer',
        section: 'calls',
        label: 'Enable auto-answer',
        type: 'checkbox',
        cb: 'sip',
        defaultVal: 0,
        info: 'This option allows to automatically answer calls even if not physically at the location where the device is located. We recommend enabling this feature only for test purposes. Enable Auto-answer to automatically answer incoming calls. If the device is set to Do not Disturb or if there are no available lines, the Forward rules will apply. If there are no Forward rules specified, the incoming call will be sent to voice mail. If voice mail is not supported, the call will be rejected. By default this is unchecked.'
    }, {
        name: 'audio.ring-tone',
        section: 'calls',
        label: 'Ring tone',
        defaultVal: 1,
        type: 'select',
        values: [{
            'val': 0,
            'label': 'Ring 1'
        }, {
            'val': 1,
            'label': 'Ring 2'
        }, {
            'val': 2,
            'label': 'Ring 3'
        }, {
            'val': 3,
            'label': 'Ring 4'
        }, {
            'val': 4,
            'label': 'Ring 5'
        }, {
            'val': 5,
            'label': 'Ring 6'
        }],
        info: 'Select from one of the six provided ring tones, Ringer 1-Ringer 6. Ringer 1 is the default ringer.'
    }, {
        name: 'voip.vm-number',
        section: 'calls',
        label: 'Voicemail number',
        type: 'text',
        pattern: /^[\d*#]+$/,
        info: 'Dialing this number will allow the user to access voicemail. By default this is blank.'
    }, {
        name: 'voip.duration',
        section: 'calls',
        label: 'Maximum call duration',
        type: 'number',
        cb: 'sip',
        max: 10080,
        info: 'Specify the maximum call duration in minutes. When the call duration reaches the maximum duration, the call will be automatically terminated. The maximum limit is 10,080 minutes, or 7 days. An empty field or 0 indicates no maximum, which is the default.'
    }, {
        name: 'voip.dial-plan',
        section: 'calls',
        label: 'Dial plan',
        type: 'textarea',
        info: 'If using a dial plan, enter the dial plan string. By default there are no dial plan.'
    }, {
        name: 'voip.always-forwarding',
        section: 'calls',
        field: 'Forwarding',
        label: 'Always forward',
        type: 'checkbox',
        info: 'Forward all incoming calls to the specified number. By default, this is unchecked.'
    }, {
        name: 'voip.always-forwarding-num',
        section: 'calls',
        field: 'Forwarding',
        label: 'Forward number',
        show: 'voip.always-forwarding',
        type: 'text',
        required: 1
    }, {
        name: 'voip.busy-forwarding',
        section: 'calls',
        field: 'Forwarding',
        label: 'Forward on busy',
        type: 'checkbox',
        info: 'Forward incoming calls to the specified number if the local device is in \'Do not Disturb\' mode or if both lines are busy. By default, this is unchecked.'
    }, {
        name: 'voip.busy-forwarding-num',
        section: 'calls',
        field: 'Forwarding',
        label: 'Forward number',
        show: 'voip.busy-forwarding',
        type: 'text',
        required: 1
    }, {
        name: 'voip.noanswer-forwarding',
        section: 'calls',
        field: 'Forwarding',
        label: 'Forward on no answer',
        type: 'checkbox',
        info: 'Forward incoming calls to the specified number if the call is not answered within the duration specified in the \'Delay on No Answer\' field. By default, this is unchecked.'
    }, {
        name: 'voip.noanswer-forwarding-num',
        section: 'calls',
        field: 'Forwarding',
        label: 'Forward number',
        show: 'voip.noanswer-forwarding',
        type: 'text',
        required: 1
    }, {
        name: 'voip.noanswer-delay',
        section: 'calls',
        field: 'Forwarding',
        label: 'Delay on no answer',
        defaultVal: 10,
        type: 'range',
        max: 30,
        min: 2,
        show: 'voip.noanswer-forwarding',
        info: 'Specify the number of seconds to wait before forwarding an unanswered incoming call to the \'Forward on No Answer\' number. The default is 10 seconds.'
    }, {
        // Network
        name: 'net.dhcp',
        section: 'network',
        label: 'Enable DHCP',
        defaultVal: 1,
        type: 'checkbox',
        info: 'Enable or disable DHCP. If this is disabled, the Static IP Address, Subnet Mask, and Default Gateway must be provided in the fields below. By default this is enabled.'
    }, {
        name: 'net.ip',
        section: 'network',
        label: 'IP address',
        type: 'ipAddress',
        placeholder: 'IP Address',
        disabled: 'net.dhcp',
        required: 1,
        info: 'The Static IP Address is the IP address that the network administrator has assigned to this device.'
    }, {
        name: 'net.subnet',
        section: 'network',
        label: 'Subnet mask',
        type: 'ipAddress',
        placeholder: 'IP Address',
        disabled: 'net.dhcp',
        required: 1,
        info: 'Subnet Mask is used to determine the subnet to which this device belongs, for example, 255.255.255.0.'
    }, {
        name: 'net.gateway',
        section: 'network',
        label: 'Default gateway',
        type: 'ipAddress',
        placeholder: 'IP Address',
        disabled: 'net.dhcp',
        required: 1,
        info: 'The Default Gateway is this device’s default router on the IP network. It is usually the router connecting the internal network with the outside network.'
    }, {
        name: 'net.dns1',
        section: 'network',
        label: 'Primary DNS',
        type: 'ipAddress',
        placeholder: 'IP Address',
        disabled: 'net.dhcp',
        info: 'This is the address of the primary Domain Name System (DNS) server that translates domain names into IP addresses. Sites often configure a primary DNS server and a secondary backup DNS server.'
    }, {
        name: 'net.dns2',
        section: 'network',
        label: 'Secondary DNS',
        type: 'ipAddress',
        placeholder: 'IP Address',
        disabled: 'net.dhcp',
        info: 'This is the address of the secondary DNS server.'
    }, {
        name: 'net.vlan',
        section: 'network',
        label: 'Voice VLAN',
        defaultVal: 2,
        type: 'select',
        values: [{
            'val': 0,
            'label': 'Enabled'
        }, {
            'val': 1,
            'label': 'Disabled'
        }, {
            'val': 2,
            'label': 'Automatic'
        }],
        info: 'The Voice VLAN ID has to be specified, the system is not trying to determine the VLAN automatically. Use this setting if the device was not able to detect the VLAN environment automatically. \'Disabled\' switches off VLAN capabilities. The device will only communicate using the standard IP network. \'Automatic\' should be used in environments that provide a Voice VLAN with automatic detection. The device will determine the VLAN identifier and register in that network.',
        show: 'sys.voip-capable'
    }, {
        name: 'net.vlan-id',
        section: 'network',
        label: 'VLAN ID',
        type: 'number',
        defaultVal: 3,
        min: 1,
        max: 4094,
        required: 1,
        cb: 'reboot',
        subOpt: {
            parent: 'sys.voip-capable',
            id: 'net.vlan',
            val: 0
        },
        info: 'Manually specify a VLAN ID value. VID range 1 to 4094, default is 3. Note per 802.1Q that VIDs 1 and 2 are reserved for specific uses.',
        // show: 'sys.voip-capable'
    }, {
        name: 'net.dot1x-enabled',
        section: 'network',
        field: 'Authentication',
        label: 'Enable 802.1x authentication',
        type: 'checkbox',
        info: 'Enable this option if devices require 802.1x authentication to access your network. Select the 802.1x authentication type and specify the required credentials. MD5 authentication requires a username and password. '
    }, {
        name: 'net.dot1x-auth-method',
        section: 'network',
        field: 'Authentication',
        label: 'Authentication method',
        type: 'select',
        values: [ {
            'val': 'MD5',
            'label': 'MD5'
        }],
        show: 'net.dot1x-enabled'
    }, {
        name: 'net.dot1x-anonymous-identity',
        section: 'network',
        field: 'Authentication',
        label: 'Anonymous identity',
        type: 'text',
        subOpt: {
            parent: 'net.dot1x-enabled',
            id: 'net.dot1x-auth-method',
            val: 'peap'
        },
        required: 1
    }, {
        name: 'net.dot1x-cert-path',
        section: 'network',
        field: 'Authentication',
        label: 'CA certificate present',
        type: 'upload',
        req: 'dot1x',
        subOpt: {
            parent: 'net.dot1x-enabled',
            id: 'net.dot1x-auth-method',
            val: 'peap'
        }
    }, {
        name: 'net.dot1x-identity',
        section: 'network',
        field: 'Authentication',
        label: 'Username',
        type: 'text',
        show: 'net.dot1x-enabled',
        required: 1
    }, {
        name: 'net.dot1x-password',
        section: 'network',
        field: 'Authentication',
        label: 'Password',
        type: 'password',
        show: 'net.dot1x-enabled',
        required: 1
    }, {
        // Region
        name: 'sys.language',
        section: 'region',
        label: 'System language',
        defaultVal: 1,
        type: 'select',
        values: [{
            'val': 1,
            'label': 'English'
        }, {
            'val': 2,
            'label': 'Español'
        }, {
            'val': 3,
            'label': 'Deutsch'
        }, {
            'val': 4,
            'label': 'Français'
        }, {
            'val': 5,
            'label': 'Italiano'
        }, {
            'val': 6,
            'label': 'Português'
        }, {
            'val': 7,
            'label': '中文'
        }, {
            'val': 8,
            'label': '日本語'
        }],
        cb: 'reboot',
        info: 'Select the device language from the list of available languages. The default language is English.'
    }, {
        name: 'sys.region',
        section: 'region',
        label: 'Regional call progress tones',
        type: 'select',
        values: [{
            'val': 1,
            'label': 'Argentina'
        }, {
            'val': 2,
            'label': 'Australia'
        }, {
            'val': 3,
            'label': 'Belgium'
        }, {
            'val': 4,
            'label': 'Brazil'
        }, {
            'val': 5,
            'label': 'Canada'
        }, {
            'val': 6,
            'label': 'Chile'
        }, {
            'val': 7,
            'label': 'China'
        }, {
            'val': 8,
            'label': 'Costa Rica'
        }, {
            'val': 9,
            'label': 'France'
        }, {
            'val': 10,
            'label': 'Germany'
        }, {
            'val': 11,
            'label': 'Hong Kong'
        }, {
            'val': 12,
            'label': 'India'
        }, {
            'val': 13,
            'label': 'Israel'
        }, {
            'val': 14,
            'label': 'Italy'
        }, {
            'val': 15,
            'label': 'Japan'
        }, {
            'val': 16,
            'label': 'Malaysia'
        }, {
            'val': 17,
            'label': 'Mexico'
        }, {
            'val': 18,
            'label': 'New Zealand'
        }, {
            'val': 19,
            'label': 'Singapore'
        }, {
            'val': 20,
            'label': 'South Africa'
        }, {
            'val': 21,
            'label': 'Taiwan'
        }, {
            'val': 22,
            'label': 'United Kingdom'
        }, {
            'val': 23,
            'label': 'USA'
        }, {
            'val': 24,
            'label': 'Venezuela'
        }],
        info: 'Select the country or region you are in, or the closest. Please change this setting from the current region to another region only if you move the unit to that different country/region, or if advised by Yamaha support to do so. The default region is USA/Canada.',
        show: 'sys.voip-capable'
    }, {
        name: 'sys.time-zone',
        section: 'region',
        label: 'Time zone',
        defaultVal: 6,
        type: 'select',
        values: [{
            'val': 0,
            'label': '-11:00 American Samoa'
        }, {
            'val': 1,
            'label': '-10:00 Hawaii'
        }, {
            'val': 2,
            'label': '-9:00 Alaska'
        }, {
            'val': 3,
            'label': '-8:00 Pacific Time'
        }, {
            'val': 4,
            'label': '-7:00 Mountain Time'
        }, {
            'val': 5,
            'label': '-6:00 Central Time'
        }, {
            'val': 6,
            'label': '-5:00 Eastern Time'
        }, {
            'val': 7,
            'label': '-4:30 Caracas'
        }, {
            'val': 8,
            'label': '-4:00 Atlantic Time'
        }, {
            'val': 9,
            'label': '-3:30 Newfoundland'
        }, {
            'val': 10,
            'label': '-3:00 Brazil/Argentina'
        }, {
            'val': 11,
            'label': '-2:00 Mid Atlantic'
        }, {
            'val': 12,
            'label': '-1:00 Azores'
        }, {
            'val': 13,
            'label': '0:00 GMT'
        }, {
            'val': 14,
            'label': '+1:00 Berlin/Paris'
        }, {
            'val': 15,
            'label': '+2:00 Athens'
        }, {
            'val': 16,
            'label': '+3:00 Kuwait'
        }, {
            'val': 17,
            'label': '+3:30 Tehran'
        }, {
            'val': 18,
            'label': '+4:00 Abu Dhabi'
        }, {
            'val': 19,
            'label': '+4:30 Kabul'
        }, {
            'val': 20,
            'label': '+5:00 Islamabad'
        }, {
            'val': 21,
            'label': '+5:30 Mumbai'
        }, {
            'val': 22,
            'label': '+5:45 Kathmandu'
        }, {
            'val': 23,
            'label': '+6:00 Dhaka'
        }, {
            'val': 24,
            'label': '+6:30 Yangon'
        }, {
            'val': 25,
            'label': '+7:00 Bangkok'
        }, {
            'val': 26,
            'label': '+8:00 Beijing/Hong Kong'
        }, {
            'val': 27,
            'label': '+9:00 Tokyo'
        }, {
            'val': 28,
            'label': '+9:30 Adelaide'
        }, {
            'val': 29,
            'label': '+10:00 Sydney'
        }, {
            'val': 30,
            'label': '+11:00 New Caledonia'
        }, {
            'val': 31,
            'label': '+12:00 Auckland'
        }, {
            'val': 32,
            'label': '+13:00 Nuku\'alofa'
        }],
        info: 'Select the local time zone, indicated as an offset from Greenwich Mean Time (GMT). The default setting is GMT -5 Eastern Standard Time.'
    }, {
        name: 'sys.date-format',
        section: 'region',
        field: 'Time',
        label: 'Date format',
        type: 'select',
        values: [{
            'val': 'MM/DD/YYYY',
            'label': 'MM/DD/YYYY'
        }, {
            'val': 'DD/MM/YYYY',
            'label': 'DD/MM/YYYY'
        }, {
            'val': 'YYYY/MM/DD',
            'label': 'YYYY/MM/DD'
        }],
        info: 'Select a date format that is appropriate for your locale. The default setting is Month/Day/Year (MM/DD/YYYY).'
    }, {
        name: 'sys.twenty-four-hour-time',
        section: 'region',
        field: 'Time',
        label: 'Enable 24 hour time format',
        type: 'checkbox',
        info: 'Check this to enable 24 hour time format. This is off by default.'
    }, {
        name: 'net.ntp-enabled',
        section: 'region',
        field: 'Time',
        label: 'NTP support',
        type: 'checkbox',
        info: 'Check this to enable NTP support. This is on by default.'
    }, {
     
        name: 'net.ntp1',
        section: 'region',
        field: 'Time',
        label: 'Network time server 1',
        defaultVal: 'time-a.nist.gov',
        type: 'ipAddress',
        placeholder: 'IP Address',
        required: 1,
        show: 'net.ntp-enabled',
        info: 'Specifies the IP addresses of NTP (Network Time Protocol) servers. The device will provide standard NTP servers at start-up. If local NTP servers or other NTP servers should be used, provide them in these settings.'
    }, {
        name: 'net.ntp2',
        section: 'region',
        field: 'Time',
        label: 'Network time server 2',
        defaultVal: 'time-b.nist.gov',
        show: 'net.ntp-enabled',
        type: 'ipAddress'
    }, {
        name: 'net.ntp3',
        section: 'region',
        field: 'Time',
        label: 'Network time server 3',
        show: 'net.ntp-enabled',
        type: 'ipAddress'
    }, {
        name: 'net.ntp4',
        section: 'region',
        field: 'Time',
        label: 'Network time server 4',
        show: 'net.ntp-enabled',
        type: 'ipAddress'
    }, {
        name: 'sys.dst-enabled',
        section: 'region',
        field: 'Daylight Saving',
        label: 'Enable Daylight Saving Time adjustment',
        defaultVal: 1,
        type: 'checkbox',
        info: 'Specify whether you want the system to automatically adjust the time according to your locale\'s DST rules. If enabled, the DST rules must be provided below. If disabled, the system will not adjust for DST. By default this is disabled.'
    }, {
        name: 'sys.dst-start-rules',
        section: 'region',
        field: 'Daylight Saving',
        label: 'Daylight Saving Time start time',
        show: 'sys.dst-enabled',
        type: 'DST',
        info: 'Use the DST Start Rule options to indicate the month, week, day and hour that the time changes. In the US, this defaults to the second Sunday in March at 2 AM, when the clock is adjusted ahead 1 hour to 3 AM.'
    }, {
        name: 'sys.dst-end-rules',
        section: 'region',
        field: 'Daylight Saving',
        label: 'Daylight Saving Time end time',
        show: 'sys.dst-enabled',
        type: 'DST',
        info: 'Use the DST End Rule options to indicate the month, week, day and hour that the time changes. In the US, this defaults to the first Sunday in November at 2 AM, when the clock is adjusted back 1 hour to 1 AM.'
    }, {
        // SIP
        name: 'voip.registrar',
        section: 'sip',
        field: 'Registration',
        label: 'Registrar',
        required: 1,
        //type: 'uniformResourceIdentifier',
        pattern: /^((http|https):\/\/)?(([a-z0-9]|[a-z0-9][a-z0-9\-]*[a-z0-9])\.)*([a-z0-9]|[a-z0-9][a-z0-9\-]*[a-z0-9])(:[0-9]*)?$/,
        patternMsg: 'Please enter a valid IP address or domain name.',
        //placeholder: 'IP Address',
        cb: 'sip',
        info: 'This is the IP address or DNS name of the SIP registrar server. This is required.'
    }, {
        name: 'voip.registrar-backup',
        section: 'sip',
        field: 'Registration',
        label: 'Backup registrar',
        //type: 'ipAddress',
        pattern: /^((http|https):\/\/)?(([a-z0-9]|[a-z0-9][a-z0-9\-]*[a-z0-9])\.)*([a-z0-9]|[a-z0-9][a-z0-9\-]*[a-z0-9])(:[0-9]*)?$/,
        patternMsg: 'Please enter a valid IP address or domain name.',
        //placeholder: 'IP Address',
        cb: 'sip',
        info: 'This field can hold the IP address of a failover SIP registrar, it should be configured with the failover or secondary SIP registrar IP address or domain name if applicable. If no failover or secondary SIP registrar is present in the VoIP infrastructure, this field should be left blank. When this field is specified, the phone will register with the primary SIP registrar \(The \'Registrar\' field\) if it is accessible. If the primary SIP registrar becomes inaccessible via UDP or TCP, the phone will attempt to register with the backup registrar. If the phone successfully registered with backup registrar, it will switch to the backup registrar to perform outgoing calls and receive incoming calls. While the phone is registered with the backup registrar, it will monitor the primary SIP registrar connection. Once the primary SIP registrar becomes available again, the phone will roll back to register with the primary registrar and route SIP traffic from/to the primary registrar.'
    }, {
        name: 'voip.realm',
        section: 'sip',
        field: 'Registration',
        label: 'VoIP realm',
        type: 'text',
        cb: 'sip',
        info: 'This field is the realm of the credential to authenticate against the server. The value here must match the realm sent by the server in the WWW-Authenticate or Proxy-Authenticate header in the 401/407 response. Use an asterisk (\'*\') if the realm is not known, which will cause the endpoint to respond to any realms.'
    }, {
        name: 'voip.proxy',
        section: 'sip',
        field: 'Registration',
        label: 'Proxy',
        type: 'text',
        cb: 'sip',
        info: 'Enter the outbound SIP proxy server’s IP address or name here. If there are multiple SIP proxies, separate the addresses by a comma. Also note that if the allow strict routing option is set and you have a SIP proxy that is configured for loose routing, add the \';lr\' designation after the proxy’s address, for example, \'10.134.129.101;lr\'.'
    }, {
        name: 'voip.reg-use-proxy',
        section: 'sip',
        field: 'Registration',
        label: 'Use proxy for registration',
        type: 'checkbox',
        cb: 'sip',
        info: 'Use this option to indicate whether or not the SIP proxy server(s) specified in the Proxy field should be used when registering. Selecting this option will add the listed proxy server(s) to the route headers of the SIP REGISTER request. By default, this is disabled.'
    }, {
        name: 'voip.user',
        section: 'sip',
        field: 'Registration',
        label: 'Username',
        required: 1,
        type: 'text',
        cb: 'sip',
        info: 'This is the username for the account used to authenticate with the SIP registrar and proxies. This is required.'
    }, {
        name: 'voip.password',
        section: 'sip',
        field: 'Registration',
        label: 'Password',
        type: 'password',
        cb: 'sip',
        info: 'This is the password for the account used to authenticate with the SIP registrar and proxies. This is required.'
    }, {
        name: 'voip.id',
        section: 'sip',
        field: 'Registration',
        label: 'User ID',
        type: 'text',
        cb: 'sip',
        info: 'ID is the device\'s SIP ID used for SIP registration. If this field is left blank, the Username field will be used as the ID.'
    }, {
        name: 'voip.name',
        section: 'sip',
        field: 'Registration',
        label: 'Display name',
        type: 'text',
        cb: 'sip',
        info: 'Display Name is shown when you make outbound calls. If you do not provide a Display Name, the Username will be used. Please note that your IP PBX might override the Display name sent by the device and replace it with names configured in the PBX.'
    }, {
        name: 'voip.reg-timeout',
        section: 'sip',
        field: 'Registration',
        label: 'Registration timeout',
        placeholder: 'Seconds',
        type: 'number',
        defaultVal: 60,
        min: 1,
        max: 604800,
        required: 1,
        cb: 'sip',
        info: 'Registration Timeout is the optional timeout for SIP account registration, in seconds. The default is 60, and the maximum is 604800 seconds, which is 7 days.'
    }, {
        name: 'voip.rereg-delay',
        section: 'sip',
        field: 'Registration',
        label: 'Registration retry interval',
        placeholder: 'Seconds',
        type: 'number',
        defaultVal: 300,
        min: 1,
        max: 604800,
        cb: 'sip',
        info: 'If SIP registration is unsuccessful, this field specified the time duration between retry attempts, in seconds. The minimum is 1, the default is 300 seconds, which is 5 minutes, and the max is 604800, which is 7 days.'
    }, {
        name: 'voip.use-timer',
        section: 'sip',
        field: 'Configuration',
        label: 'Use SIP session timers',
        defaultVal: 1,
        type: 'select',
        values: [{
            'val': 0,
            'label': 'Inactive'
        }, {
            'val': 1,
            'label': 'Optional'
        }, {
            'val': 2,
            'label': 'Mandatory'
        }, {
            'val': 3,
            'label': 'Always'
        }],
        cb: 'sip',
        info: 'Specify the preference for using SIP session keep-alive timers. During a SIP session, if SIP session timers are active, the SIP User Agent (UA) periodically sends INVITE or UPDATE requests (also called refresh requests) to keep the SIP session alive. The interval and use of the keep-alive is determined at call negotiation. If one of the UAs in a call does not receive the refresh request within the expiration timeout period, it will terminate the session. The available options in the device are: Inactive – Session Timers will not be used in any session, except if explicitly required in the remote request. Optional – Session Timers will be used in all sessions whenever the remote supports and uses it. This option is the device default. Mandatory – Session Timers support will be a requirement for the remote to be able to establish a session. Always – Session Timers will always be used in all sessions, regardless of whether the remote supports or uses it or not.'
    }, {
        name: 'voip.timer-se',
        section: 'sip',
        field: 'Configuration',
        label: 'Session timers expiration',
        placeholder: 'Seconds',
        defaultVal: 1800,
        min: 90,
        max: 604800,
        type: 'number',
        show: 'voip.use-timer',
        cb: 'sip',
        info: 'The expiration period is the interval at which the device will consider the SIP session timed out if it does not receive a refresh message from the remote SIP device. At call negotiation, the nodes will negotiate the expiration period to be used for the session. If less than the session timers minimum expiration, then the session timer minimum expiration is used instead. It is measured in seconds; the default is 1800, it must be greater than 90, and the max is 604800, which is 7 days.'
    }, {
        name: 'voip.timer-min-se',
        section: 'sip',
        field: 'Configuration',
        label: 'Session timers min expiration',
        placeholder: 'Seconds',
        defaultVal: 90,
        min: 90,
        max: 604800,
        type: 'number',
        show: 'voip.use-timer',
        cb: 'sip',
        info: 'This is the minimum session timer expiration period that the device will accept when negotiating the expiration period with the remote SIP device. If the session timer expiration duration is less than this value, this value is used instead. It is measured in seconds; the default is 90, the max is 604800, which is 7 days.'
    }, {
        name: 'voip.use-100rel',
        section: 'sip',
        field: 'Configuration',
        label: 'Require reliable SIP provisional response',
        type: 'checkbox',
        cb: 'sip',
        info: 'Select this option to implement reliable SIP provisional responses. By default the setting is unchecked. SIP is a request-response type of protocol with two types of responses: provisional and final. Final responses are sent reliably, using an ACK to ensure receipt. Provisional responses by default are not sent reliably and do not require an ACK; however, in some cases, such as for PSTN interoperability support, reliability of provisional types of responses is needed. Choose this option to add the PRACK (provisional ACK) message support for reliability.'
    }, {
        name: 'voip.auto-update-nat',
        section: 'sip',
        field: 'Configuration',
        label: 'Enable SIP traversal behind symmetric NAT',
        defaultVal: 1,
        type: 'checkbox',
        cb: 'sip',
        info: 'This option may be used when the device is behind a symmetric NAT (Network Address Translation). When enabled, the device will keep track of the public IP address from the response of the REGISTER request. If it detects that the address has changed, it will unregister the current Contact, update the Contact with the transport address obtained from the Via header, and register a new Contact to the SIP registrar. This option will also update the public name of the UDP transport if STUN is configured. By default this is enabled.'
    }, {
        name: 'voip.no-refer-sub',
        section: 'sip',
        field: 'Configuration',
        label: 'Suppress SIP event subscription during call transfer',
        type: 'checkbox',
        cb: 'sip',
        info: 'When transferring a SIP call, the SIP REFER process automatically establishes a temporary event subscription to notify the party initiating the transfer about the receiver’s status in handling the REFER. In some cases these event subscriptions and notifications are not needed, such as when forking is not used. Enable this option to suppress the automatic event subscriptions when transferring calls. The option is disabled by default. (See IETF RFC 4488.)'
    }, {
        name: 'voip.allow-strict',
        section: 'sip',
        field: 'Configuration',
        label: 'Allow strict routing',
        type: 'checkbox',
        cb: 'sip',
        info: 'By default, proxies specified for SIP registration will be configured as loose-routing proxies. The loose-routing designation (\';lr\') will be automatically appended to each proxy address when the proxy is added to the SIP Route header. Older proxies may be strict-routing (see IETF RFC 2543), not supporting loose routing (see IETF RFC 3261). Enable this option if you are using strict-routing proxies. If this option is enabled and you are specifying one or more loose-routing proxies in the Proxy field, then you must manually add the \";lr\" suffix to each loose-routing proxy address. For example, \"10.134.123.101;lr\".'
    }, {
        name: 'voip.min-size',
        section: 'sip',
        field: 'Configuration',
        label: 'Minimize SIP message size',
        type: 'checkbox',
        cb: 'sip',
        info: 'The SIP protocol specifies that header field names can be in the full name form or in the abbreviated form. Abbreviated form is useful when messages might be too large to be carried on the available transport, for example when exceeding UDP’s Maximum Transmission Unit (MTU). Enable this option to encode SIP headers in their short forms to reduce size. By default, the option is not enabled and SIP headers in outgoing messages will be encoded in their full names. (See SIP protocol standard, IETF RFC 3261.)'
    }, {
        name: 'voip.dtmf-method',
        section: 'sip',
        field: 'Configuration',
        cb: 'sip',
        label: 'DTMF signaling method',
        type: 'select',
        values: [{
            'val': 0,
            'label': 'RTP (RFC2833)'
        }, {
            'val': 1,
            'label': 'SIP INFO'
        }, {
            'val': 2,
            'label': 'Inband'
        }],
        info: 'Select the signaling method for transmitting DTMF tones, either via RTP (RFC2833), SIP INFO messages or in-band. The default is RTP.'
    }, {
        name: 'voip.dtmf-rtp-payload-type',
        section: 'sip',
        field: 'Configuration',
        label: 'DTMF RTP payload type',
        defaultVal: 96,
        type: 'range',
        min: 96,
        max: 127,
        cb: 'sip',
        info: 'Specify the dynamic payload type for DTMF RTP signaling. The range is 96 to 127, default value is 96.'
    }, {
        name: 'voip.media-onhold-method',
        section: 'sip',
        field: 'Configuration',
        label: 'Media on-hold method',
        type: 'select',
        values: [{
            'val': 0,
            'label': 'M line only (RFC3264)'
        }, {
            'val': 1,
            'label': 'M and C line (RFC2543)'
        }],
        cb: 'sip',
        info: 'The Media on hold method setting allows switching the Media on Hold behavior between the different RFC definitions. \'M line only (RFC3264)\' implements the functionality according to RFC3264, and is the default. In the INVITE message SDP body, the attribute \'a=sendonly\' is set to a designated media stream to put media on-hold. \'M and C line (RFC2543)\' implements the functionality according to RFC2543. In the INVITE message SDP body, the connection line ip is set to \'0.0.0.0\' (e.g. \'c= IN IP4 0.0.0.0\'), and the attribute \'a=inactive\' is added.'
    }, {
        // Transport
        name: 'voip.set-qos',
        section: 'transport',
        label: 'Enable QoS',
        type: 'checkbox',
        cb: 'sip',
        info: 'Select this option to enable QoS (Quality of Service) tagging for SIP and media. For layer 3, at the Internet layer, the DiffServ (Differentiated Services) precedence level is Class 3. The Differentiated Services Code Point (DSCP) in the IP header is set to 24 (0x18). For layer 2, IEEE 802.1p tagging is supported. This option is unchecked by default.'
    }, {
        name: 'voip.udp-tcp-selection',
        section: 'transport',
        label: 'Enable TCP transport protocol',
        type: 'checkbox',
        cb: 'sip',
        info: 'Select the transport that will be enabled for SIP messages. The options are TCP or UDP. The default is UDP if it is available.'
    }, {
        name: 'voip.local-port',
        section: 'transport',
        label: 'Local port',
        defaultVal: 5060,
        min: 1024,
        max: 65535,
        type: 'number',
        cb: 'sip',
        info: 'Specify the local port for SIP transport. The default is 5060 for UDP and TCP. (Both use the same port.) The range is 1024 to 65535.'
    }, {
        name: 'voip.use-srtp',
        section: 'transport',
        label: 'Enable SRTP',
        type: 'select',
        cb: 'sip',
        values: [{
            'val': 0,
            'label': 'Disabled'
        }, {
            'val': 1,
            'label': 'Optional'
        }, {
            'val': 2,
            'label': 'Mandatory'
        }],
        info: 'Use this setting to control Secure Real-time Transport Protocol (SRTP) usage. These are the available options: Disabled – Do not use SRTP; always use RTP. This is the default setting. Optional – Use the optional disposition for SRTP in SDP. If the remote end supports SRTP, then use SRTP; otherwise, use RTP. Mandatory – Force use of SRTP. If the remote end does not support SRTP, the call does not connect.'
    }, {
        name: 'voip.rtp-port',
        section: 'transport',
        label: 'RTP port',
        defaultVal: 4000,
        min: 1024,
        max: 65535,
        type: 'number',
        cb: 'sip',
        info: 'This is the base port number for RTP. The default is 4000. RTP is originated and received on even port numbers, and the associated RTCP uses the next higher odd port number. The range is 1024 to 65535.'
    }, {
        name: 'voip.ip-addr',
        section: 'transport',
        label: 'SIP/RTP IP address',
        type: 'ipAddress',
        placeholder: 'IP Address',
        cb: 'sip',
        info: 'Optional. If specified, use this IP address (or hostname) as the advertised SIP and RTP address of this transport (the public address). The IP address does not have to correspond with one of the local host network interfaces; it may be the public IP address of a NAT router where port mappings have been configured for the SIP application.'
    }, {
        name: 'voip.stun-srv',
        section: 'transport',
        label: 'STUN server',
        type: 'ipAddress',
        placeholder: 'IP Address',
        cb: 'sip',
        info: 'Optional. Specify the STUN (Session Traversal Utilities for NAT) server to use to determine if the device is behind a NAT, the type of NAT, and the public address of the device. The field can contain a comma separated list of servers. Each server can be a domain name, host name, or IP address, and it may contain an optional port number. (For STUN see IETF RFC 5389.)'
    }, {
        name: 'voip.use-ice',
        section: 'transport',
        field: 'ICE',
        label: 'Enable ICE',
        type: 'checkbox',
        cb: 'sip',
        info: 'Check this option to use the ICE (Interactive Connectivity Establishment) protocol for NAT traversal. This option is unchecked by default. ICE takes advantage of STUN and TURN to identify candidates (IP addresses and ports) for communication, evaluating and prioritizing the candidate pairs to select the best route. Expensive candidates, such as using a media relay, are selected only as a last resort. (For ICE see IETF RFC 5245.)'
    }, {
        name: 'voip.ice-regular',
        section: 'transport',
        field: 'ICE',
        label: 'Enable aggressive ICE nomination',
        defaultVal: 1,
        show: 'voip.use-ice',
        type: 'checkbox',
        cb: 'sip',
        info: 'When using ICE, select the preferred ICE Nomination Method. To validate candidate pairs (IP addresses and ports for the local and remote nodes), the device sends STUN binding requests as part of the media connectivity tests. When a candidate is nominated for use, a STUN binding request is sent with a flag indicating that the candidate pair is nominated. There are two nomination methods that can be used: Regular – For Regular Nomination, the device validates candidate pairs with initial STUN binding requests, and then selects a valid candidate pair by sending another STUN binding request with a flag indicating that the pair is nominated. Aggressive – For Aggressive Nomination, the device doesn’t wait to set the nominated flag in a second STUN binding request, but rather sets the flag in the STUN binding requests for all of the candidate pairs. The ICE processing completes when the first pair successfully passes connectivity checks. The aggressive method is faster but does not always result in the optimal path being selected. This is the default method.'
    }, {
        name: 'voip.ice-no-rtcp',
        section: 'transport',
        field: 'ICE',
        label: 'Disable RTCP',
        show: 'voip.use-ice',
        type: 'checkbox',
        cb: 'sip',
        info: 'Select this option to disable the RTCP component in ICE. This is unchecked by default.'
    }, {
        name: 'voip.ice-max-hosts',
        section: 'transport',
        field: 'ICE',
        label: 'Max allowed ICE host candidates',
        defaultVal: 5,
        min: 0,
        max: 10,
        show: 'voip.use-ice',
        type: 'number',
        cb: 'sip',
        info: 'An ICE host candidate is an actual local transport address in the host. Host transport addresses are obtained by binding to attached network interfaces. These interfaces include both physical interfaces and virtual interfaces such as VPN. This option specifies the maximum number of local ICE host candidates that may be used in evaluating candidate pairs when determining the best route. The default value is 5. The range is 0 to 10. 0 indicates that there is no maximum.'
    }, {
        name: 'voip.use-turn',
        section: 'transport',
        field: 'TURN',
        label: 'Enable TURN relay',
        type: 'checkbox',
        cb: 'sip',
        info: 'Select this option to enable the use of a TURN (Traversal Using Relay NAT) relay when using ICE. A TURN relay is a media relay server residing on the public internet which can relay media data packet between clients. TURN relays are used when other preferred mechanisms are not available, such as STUN or direct connectivity. The option is unchecked by default. If TURN is enabled, the TURN settings below (server, username and password) must also be specified.'
    }, {
        name: 'voip.turn-srv',
        section: 'transport',
        field: 'TURN',
        label: 'TURN server',
        show: 'voip.use-turn',
        required: 1,
        type: 'ipAddress',
        placeholder: 'IP Address',
        cb: 'sip',
        info: 'Specify the TURN server domain name or hostname. The format is either \'DOMAIN:PORT\' or \'HOST:PORT\''
    }, {
        name: 'voip.turn-tcp',
        section: 'transport',
        field: 'TURN',
        label: 'Use TCP connection to TURN server',
        show: 'voip.use-turn',
        type: 'checkbox',
        cb: 'sip',
        info: 'Use TCP to communicate with the TURN server rather than UDP.'
    }, {
        name: 'voip.turn-user',
        section: 'transport',
        field: 'TURN',
        label: 'TURN username',
        show: 'voip.use-turn',
        required: 1,
        type: 'text',
        cb: 'sip',
        info: 'Specify the username to authenticate against the TURN server.'
    }, {
        name: 'voip.turn-passwd',
        section: 'transport',
        field: 'TURN',
        label: 'TURN password',
        show: 'voip.use-turn',
        required: 1,
        type: 'password',
        cb: 'sip',
        info: 'Specify the password to authenticate against the TURN server.'
    }, {
        // Tools
        name: 'sys.verbose-log-enabled',
        label: 'Enable verbose logging',
        type: 'checkbox'
    }, {
        name: 'sys.voip-capable',
        type: 'number'
    }
];
var dstValues = [{
    label: 'Month',
    vals: [{
        'val': '1',
        'label': 'January'
    }, {
        'val': '2',
        'label': 'February'
    }, {
        'val': '3',
        'label': 'March'
    }, {
        'val': '4',
        'label': 'April'
    }, {
        'val': '5',
        'label': 'May'
    }, {
        'val': '6',
        'label': 'June'
    }, {
        'val': '7',
        'label': 'July'
    }, {
        'val': '8',
        'label': 'August'
    }, {
        'val': '9',
        'label': 'September'
    }, {
        'val': '10',
        'label': 'October'
    }, {
        'val': '11',
        'label': 'November'
    }, {
        'val': '12',
        'label': 'December'
    }]
}, {
    label: 'Week',
    vals: [{
        'val': '1',
        'label': 'First'
    }, {
        'val': '2',
        'label': 'Second'
    }, {
        'val': '3',
        'label': 'Third'
    }, {
        'val': '4',
        'label': 'Fourth'
    }, {
        'val': '5',
        'label': 'Last'
    }]
}, {
    label: 'Day',
    vals: [{
        'val': '1',
        'label': 'Sunday'
    }, {
        'val': '2',
        'label': 'Monday'
    }, {
        'val': '3',
        'label': 'Tuesday'
    }, {
        'val': '4',
        'label': 'Wednesday'
    }, {
        'val': '5',
        'label': 'Thursday'
    }, {
        'val': '6',
        'label': 'Friday'
    }, {
        'val': '7',
        'label': 'Saturday'
    }]
}];
var dstHours = [{
    'val': '0',
    'label': '12 AM',
    'alt': '00:00'
}, {
    'val': '1',
    'label': '1 AM',
    'alt': '01:00'
}, {
    'val': '2',
    'label': '2 AM',
    'alt': '02:00'
}, {
    'val': '3',
    'label': '3 AM',
    'alt': '03:00'
}, {
    'val': '4',
    'label': '4 AM',
    'alt': '04:00'
}, {
    'val': '5',
    'label': '5 AM',
    'alt': '05:00'
}, {
    'val': '6',
    'label': '6 AM',
    'alt': '06:00'
}, {
    'val': '7',
    'label': '7 AM',
    'alt': '07:00'
}, {
    'val': '8',
    'label': '8 AM',
    'alt': '08:00'
}, {
    'val': '9',
    'label': '9 AM',
    'alt': '09:00'
}, {
    'val': '10',
    'label': '10 AM',
    'alt': '10:00'
}, {
    'val': '11',
    'label': '11 AM',
    'alt': '11:00'
}, {
    'val': '12',
    'label': '12 PM',
    'alt': '12:00'
}, {
    'val': '13',
    'label': '1 PM',
    'alt': '13:00'
}, {
    'val': '14',
    'label': '2 PM',
    'alt': '14:00'
}, {
    'val': '15',
    'label': '3 PM',
    'alt': '15:00'
}, {
    'val': '16',
    'label': '4 PM',
    'alt': '16:00'
}, {
    'val': '17',
    'label': '5 PM',
    'alt': '17:00'
}, {
    'val': '18',
    'label': '6 PM',
    'alt': '18:00'
}, {
    'val': '19',
    'label': '7 PM',
    'alt': '19:00'
}, {
    'val': '20',
    'label': '8 PM',
    'alt': '20:00'
}, {
    'val': '21',
    'label': '9 PM',
    'alt': '21:00'
}, {
    'val': '22',
    'label': '10 PM',
    'alt': '22:00'
}, {
    'val': '23',
    'label': '11 PM',
    'alt': '23:00'
}];

