const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
  contactPoints: ['cassandra:9042'],
  localDataCenter: 'datacenter1',
  keyspace: 'book_catalog'
});

module.exports = client;