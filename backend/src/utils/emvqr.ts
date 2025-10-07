// Minimal EMVCo MPM QR generator for QatarCash (demo purposes)
// IDs used: 00 (Payload Format), 01 (POI Method Static), 52 (MCC), 53 (Txn Currency), 54 (Amount),
// 58 (Country), 59 (Merchant Name), 60 (Merchant City), 62 (Additional Data), 63 (CRC)
// For production, extend with proper merchant account templates (26-51) per acquirer/NAPS spec.

function tlv(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

function crc16ccitt(hexStr: string): string {
  // Compute CRC over ASCII string bytes
  let crc = 0xFFFF;
  for (let i = 0; i < hexStr.length; i++) {
    crc ^= hexStr.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) crc = (crc << 1) ^ 0x1021;
      else crc = crc << 1;
      crc &= 0xFFFF;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export type EmvOptions = {
  merchantName: string;
  merchantCity: string;
  currencyNumeric: string; // ISO 4217 numeric, e.g., QAR = 634
  amount?: string;         // formatted decimal, e.g., "150.00"
  mcc?: string;            // Merchant Category Code, default "0000" unknown
  country?: string;        // "QA"
  reference?: string;      // merchant reference (62.05)
  // Merchant Account Information template (IDs 26..51)
  // Provide as comma-separated env (e.g., '26:00:QATAR:01:12345;51:00:FOO')
  merchantTlv?: string;

};

export function buildEmvMpm(opts: EmvOptions): string {
  const mcc = opts.mcc || "0000";
  const ctry = opts.country || "QA";

  // Additional data (ID 62). We'll place 62.05 (Reference) if provided.
  let addl = "";
  if (opts.reference) {
    // 05 Merchant Reference
    const refTLV = tlv("05", opts.reference);
    addl = tlv("62", refTLV);
  }

  
  // Merchant Account Info TLVs (26..51) from env or opts
  let mai = '';
  const envTlv = process.env.MERCHANT_TLV || '';
  const src = opts.merchantTlv || envTlv;
  if (src){
    // Format: segments separated by ';', each segment is 'ID:subID:value' chain
    // Example: '26:00:QATAR:01:12345' -> ID 26 with sub TLVs (00=QATAR, 01=12345)
    const parts = src.split(';').filter(Boolean);
    for (const seg of parts){
      const bits = seg.split(':');
      const id = bits.shift() || '';
      let sub = '';
      for (let i=0;i<bits.length;i+=2){
        const sid = bits[i]; const sval = bits[i+1] || '';
        sub += tlv(sid, sval);
      }
      mai += tlv(id, sub);
    }
  }

  // Construct base without CRC
  const payload = [
    mai,
    tlv("00", "01"),           // Payload Format Indicator (01 = EMVCo spec v1.1)
    tlv("01", "11"),           // POI Method (11=Static) - demo: static QR per link
    tlv("52", mcc),            // MCC
    tlv("53", opts.currencyNumeric),
    opts.amount ? tlv("54", opts.amount) : "",
    tlv("58", ctry),
    tlv("59", opts.merchantName),
    tlv("60", opts.merchantCity),
    addl,
    "6304"                     // CRC placeholder (ID 63 length 04 + CRC)
  ].join("");

  const crc = crc16ccitt(payload);
  return payload + crc;
}
