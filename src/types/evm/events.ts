import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v193 from '../v193'

export const log =  {
    name: 'EVM.Log',
    /**
     * Ethereum events from contracts.
     */
    v193: new EventType(
        'EVM.Log',
        sts.struct({
            log: v193.Log,
        })
    ),
}

export const executed =  {
    name: 'EVM.Executed',
    /**
     * A contract has been executed successfully with states applied.
     */
    v193: new EventType(
        'EVM.Executed',
        sts.struct({
            address: v193.H160,
        })
    ),
}
