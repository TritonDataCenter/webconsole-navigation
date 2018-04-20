'use strict';

module.exports = [
  {
    name: 'Compute',
    services: [
      {
        name: 'VMs & Containers',
        slug: 'instances',
        description: 'Run VMs and bare metal containers'
      }
    ]
  },
  {
    name: 'Network',
    services: [
      {
        name: 'VLANs',
        slug: 'vlans',
        description: 'Wire your application your way'
      },
      {
        name: 'Subnets',
        slug: 'subnets',
        description: 'A network for everything'
      },
      {
        name: 'Firewall Rules',
        slug: 'firewall',
        description: 'Control traffic across instances'
      }
    ]
  },
  {
    name: 'Storage',
    services: [
      {
        name: 'Triton Object Storage',
        slug: 'object-storage',
        description: 'Modern cloud object storage',
        tags: ["'note'='was Manta'"]
      },
      {
        name: 'S3 Compatibility Bridge',
        slug: 's3-bridge',
        description: 'Modern storage, legacy compability'
      },
      {
        name: 'Triton Volumes',
        slug: 'volumes',
        description: 'Network filesystems for your apps',
        tags: ["'is-new'='true'"]
      }
    ]
  },
  {
    name: 'Access',
    services: [
      {
        name: 'Role Based Access Control',
        slug: 'rbac',
        description: 'Manage users within your account'
      }
    ]
  },
  {
    name: 'Help & Support',
    services: [
      {
        name: 'Service Status',
        slug: 'status',
        description: 'Find out the status of our services'
      },
      {
        name: 'Contact Support',
        slug: 'contact-support',
        description: 'Contact our experts for help'
      },
      {
        name: 'Support Plans',
        slug: 'support-plans',
        description: 'Learn about premium support plans'
      },
      {
        name: 'Getting Started',
        slug: 'getting-started',
        description: 'Guides for building and managing applications'
      }
    ]
  }
];
