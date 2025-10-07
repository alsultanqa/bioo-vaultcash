import Redis from 'ioredis';
import { cfg } from '../config';

export const redis = new Redis(cfg.redisUrl, { lazyConnect: true });
export async function ensureRedis() { if ((redis as any).status !== 'ready') await redis.connect(); }
