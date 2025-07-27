import assert from 'assert'
import { hexToU8a } from '@polkadot/util'
import { encodeAddress } from '@polkadot/util-crypto'

/// Convert the EVM address to Substrate address
/// Default ss58Prefix is 0
export function evmToSubstrate(address: string, ss58Prefix = 0): string {
    if (address.startsWith('0x')) {
        address = address.slice(2)
    }
    assert(address.length === 40, 'Invalid EVM address')
    const u8a = hexToU8a(address)
    return encodeAddress(u8a, ss58Prefix)
}
    