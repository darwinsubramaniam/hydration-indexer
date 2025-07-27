import { Interface, id } from "ethers";
import { ADDRESS_PROVIDER_V2_ABI } from "../abi/address_provider_v2_abi";
import { A_TOKEN_V2_ABI } from "../abi/aToken_v2_abi";
import { INCENTIVES_CONTROLLER_ABI } from "../abi/incentivesController_abi";
import { LENDING_POOL_V2_ABI } from "../abi/lending_pool_v2_abi";
import { REWARDS_CONTROLLER_ABI } from "../abi/rewardsController_v3_abi";

export interface PartToBuildSignature {
    inputs: [
        { 
            internalType: string,
            name:string
        }
    ],
    name: string
}

export interface FunSignInputMapping {
    hash: string;
    name: string;
    signature: string;
    inputs: [{
        internalType: string;
        name: string;
    }];
    iface: Interface;
}


export class AbiUtils {

    private CONSTRUCTOR_FUNCTION = 'INIT'
    private _signatures: FunSignInputMapping[] = []

    public get signatures() {
        if(this._signatures.length === 0) {
            this._signatures = this.allSignatures()
        }
        return this._signatures
    }


    private  allSignatures() {
        let allLendingSignature = LENDING_POOL_V2_ABI
            .map(x => this.buildSignature(x as unknown as PartToBuildSignature))
            .filter(x => x.name !== this.CONSTRUCTOR_FUNCTION)
            .map(x => ({
                iface: new Interface(LENDING_POOL_V2_ABI),
                ...x
            }));
    
        let allATokenSignature = A_TOKEN_V2_ABI
            .map(x => this.buildSignature(x as unknown as PartToBuildSignature))
            .filter(x => x.name !== this.CONSTRUCTOR_FUNCTION)
            .map(x => {
                return {
                    iface: new Interface(A_TOKEN_V2_ABI),
                    ...x
                }
            });
    
        let allAddressProvider = ADDRESS_PROVIDER_V2_ABI
            .map(x => this.buildSignature(x as unknown as PartToBuildSignature))
            .filter(x => x.name !== this.CONSTRUCTOR_FUNCTION)
            .map(x => {
                return {
                    iface: new Interface(ADDRESS_PROVIDER_V2_ABI),
                    ...x
                }
            });
    
        let allIncentivesController = INCENTIVES_CONTROLLER_ABI
            .map(x => this.buildSignature(x as unknown as PartToBuildSignature))
            .filter(x => x.name !== this.CONSTRUCTOR_FUNCTION)
            .map(x => {
                return {
                    iface: new Interface(INCENTIVES_CONTROLLER_ABI),
                    ...x
                }
            });
    
        let allRewardsController = REWARDS_CONTROLLER_ABI
            .map(x => this.buildSignature(x as unknown as PartToBuildSignature))
            .filter(x => x.name !== this.CONSTRUCTOR_FUNCTION)
            .map(x => {
                return {
                    iface: new Interface(REWARDS_CONTROLLER_ABI),
                    ...x
                }
            })
    
    
        return [...allATokenSignature, ...allAddressProvider, ...allLendingSignature, ...allIncentivesController, ...allRewardsController]
            .map(x => {
                let hash = id(x.signature)
                let withHash =  {
                    ...x, hash
                }
                return withHash;
            })
    }


    private buildSignature(partialAbi: Partial<PartToBuildSignature>): { name: string, signature: string , inputs:[{internalType:string, name:string}]} {
        if (!partialAbi.inputs) {
            throw new Error('Not expected ABI - missing inputs')
        }
    
        if (!partialAbi.name) {
            return {
                name: this.CONSTRUCTOR_FUNCTION,
                signature: this.CONSTRUCTOR_FUNCTION,
                inputs:[{
                    internalType:'none',
                    name:this.CONSTRUCTOR_FUNCTION
                }]
            }
        }
    
        const params = partialAbi.inputs.map(x => x.internalType).join(',')
        let signature = `${partialAbi.name}(${params})`
        return {
            name: partialAbi.name,
            signature,
            inputs:partialAbi.inputs!
        }
    }
}