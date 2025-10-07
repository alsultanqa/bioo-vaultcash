import prom from 'express-prom-bundle';

export const metrics = prom({
  includePath: true,
  includeMethod: true,
  includeStatusCode: true,
  buckets: [0.05,0.1,0.2,0.3,0.5,0.75,1,1.5,2,3,5],
  promClient: {
    collectDefaultMetrics: {}
  }
});
