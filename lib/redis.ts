import { Redis } from '@upstash/redis';
import { env } from '@/src/config/env';

// Create Redis client if configured
export const redis = env.redis.enabled && env.redis.url && env.redis.token
    ? new Redis({
        url: env.redis.url,
        token: env.redis.token,
    })
    : null;

export default redis;
