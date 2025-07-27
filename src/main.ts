import { TypeormDatabase, Store } from '@subsquid/typeorm-store'
import { In } from 'typeorm'
import * as ss58 from '@subsquid/ss58'
import assert from 'assert'

import { processor, ProcessorContext } from './processor'
import { events } from './types'
import { AbiUtils } from './utils/abi.utils'

let allSigns = new AbiUtils().signatures

processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
    isBorrowedEvent(ctx)
})

function isBorrowedEvent(ctx: ProcessorContext<Store>) {
    for (let block of ctx.blocks) {
        for (let event of block.events) {
            if (event.name == events.evm.log.name) {
                if (events.evm.log.v193.is(event)) {
                    let a = events.evm.log.v193.decode(event)
                    let contractAddress = a.log.address
                    let topics = a.log.topics
                    let data = a.log.data

                    let eventBelongsTo = allSigns.find(x => topics[0] === x.hash)
                    if (eventBelongsTo) {
                        console.log(`Event Found Belongs to : ${eventBelongsTo.name}`)
                        const decode = eventBelongsTo.iface.decodeEventLog(eventBelongsTo.name, data, topics)
                        let paramAndValue = decode.map((x,i) => {
                            return {
                                param:eventBelongsTo.inputs[i],
                                value:x
                            }
                        })
                        console.log(`${eventBelongsTo.name} event:: ${paramAndValue.map(x => {
                            return `${x.param.name} = ${x.value}`
                        })}`)
                    }

                }
            }
        }
    }
}


// function asPerOriginal() {
//       let transferEvents: TransferEvent[] = getTransferEvents(ctx)

//     let accounts: Map<string, Account> = await createAccounts(ctx, transferEvents)
//     let transfers: Transfer[] = createTransfers(transferEvents, accounts)

//     await ctx.store.upsert([...accounts.values()])
//     await ctx.store.insert(transfers)
// }

// interface TransferEvent {
//     id: string
//     blockNumber: number
//     timestamp: Date
//     extrinsicHash?: string
//     from: string
//     to: string
//     amount: bigint
//     fee?: bigint
// }



// function getTransferEvents(ctx: ProcessorContext<Store>): TransferEvent[] {
//     // Filters and decodes the arriving events
//     let transfers: TransferEvent[] = []
//     for (let block of ctx.blocks) {
//         for (let event of block.events) {
//             if (event.name == events.balances.transfer.name) {
//                 let rec: {from: string; to: string; amount: bigint}
//                 if (events.balances.transfer.v1020.is(event)) {
//                     let [from, to, amount] = events.balances.transfer.v1020.decode(event)
//                     rec = {from, to, amount}
//                 }
//                 else if (events.balances.transfer.v1050.is(event)) {
//                     let [from, to, amount] = events.balances.transfer.v1050.decode(event)
//                     rec = {from, to, amount}
//                 }
//                 else if (events.balances.transfer.v9130.is(event)) {
//                     rec = events.balances.transfer.v9130.decode(event)
//                 }
//                 else {
//                     throw new Error('Unsupported spec')
//                 }

//                 assert(block.header.timestamp, `Got an undefined timestamp at block ${block.header.height}`)

//                 transfers.push({
//                     id: event.id,
//                     blockNumber: block.header.height,
//                     timestamp: new Date(block.header.timestamp),
//                     extrinsicHash: event.extrinsic?.hash,
//                     from: ss58.codec('kusama').encode(rec.from),
//                     to: ss58.codec('kusama').encode(rec.to),
//                     amount: rec.amount,
//                     fee: event.extrinsic?.fee || 0n,
//                 })
//             }
//         }
//     }
//     return transfers
// }

// async function createAccounts(ctx: ProcessorContext<Store>, transferEvents: TransferEvent[]): Promise<Map<string,Account>> {
//     const accountIds = new Set<string>()
//     for (let t of transferEvents) {
//         accountIds.add(t.from)
//         accountIds.add(t.to)
//     }

//     const accounts = await ctx.store.findBy(Account, {id: In([...accountIds])}).then((accounts) => {
//         return new Map(accounts.map((a) => [a.id, a]))
//     })

//     for (let t of transferEvents) {
//         updateAccounts(t.from)
//         updateAccounts(t.to)
//     }

//     function updateAccounts(id: string): void {
//         const acc = accounts.get(id)
//         if (acc == null) {
//             accounts.set(id, new Account({id}))
//         }
//     }

//     return accounts
// }

// function createTransfers(transferEvents: TransferEvent[], accounts: Map<string, Account>): Transfer[] {
//     let transfers: Transfer[] = []
//     for (let t of transferEvents) {
//         let {id, blockNumber, timestamp, extrinsicHash, amount, fee} = t
//         let from = accounts.get(t.from)
//         let to = accounts.get(t.to)
//         transfers.push(new Transfer({
//             id,
//             blockNumber,
//             timestamp,
//             extrinsicHash,
//             from,
//             to,
//             amount,
//             fee,
//         }))
//     }
//     return transfers
// }
