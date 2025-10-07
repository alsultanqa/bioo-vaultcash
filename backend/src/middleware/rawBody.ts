import { json } from 'body-parser';
export const jsonWithRaw = json({ verify: (req: any, _res, buf) => { req.rawBody = buf.toString(); } });
