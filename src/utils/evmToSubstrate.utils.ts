import { hexToU8a, u8aToU8a } from '@polkadot/util';
import { encodeAddress } from '@polkadot/util-crypto';

/// Convert the EVM address to Substrate address
/// Default ss58Prefix is 0
export function evmToSubstrate(address: string, ss58Prefix=0): string {
    let u8a = hexToU8a(address);
    return encodeAddress(u8a,ss58Prefix);
}
    