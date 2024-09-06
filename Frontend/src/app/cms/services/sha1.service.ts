import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Sha1Service {
  constructor() { }

  async sha1(message: string): Promise<string> {
    // Encode the message as a UTF-8 array
    const msgBuffer = new TextEncoder().encode(message);

    // Hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);

    // Convert the ArrayBuffer to a hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hashHex;
  }
}
