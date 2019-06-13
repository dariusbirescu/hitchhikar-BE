
const cfenv = require('cfenv');

const env = cfenv.getAppEnv({
  vcap: {
    application: {
      port: process.env.PORT || 8080,
    },
    services: {
      mongodb: [
        {
          binding_name: null,
          credentials: {
            dbname: 'test',
            password: '',
            port: '27018',
            role: 'dbOwner',
            uri: 'mongodb://localhost:27018/cars',
            username: '',
          },
          instance_name: 'mongo',
          label: 'mongodb',
          name: 'mongo',
          plan: 'v3.4-small',
          provider: null,
          syslog_drain_url: null,
          tags: ['mongodb', 'document'],
          volume_mounts: [],
        },
      ],
    },
  },
});

module.exports = {
  DB_URL: env.services.mongodb[0].credentials.uri,
  PORT: env.app.port,
};