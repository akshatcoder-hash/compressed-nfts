import { createCreateTreeInstruction, PROGRAM_ID as BUBBLEGUM_PROGRAM_ID } from "@metaplex-foundation/mpl-bubblegum"
import { SYSTEM_PROGRAM_ID } from "@raydium-io/raydium-sdk";
import { loadWalletKey, sendVersionedTx } from "./utils";
import {Connection, PublicKey, Transaction} from "@solana/web3.js"
import { SPL_ACCOUNT_COMPRESSION_PROGRAM_ID, SPL_NOOP_PROGRAM_ID, ValidDepthSizePair } from "@solana/spl-account-compression"

async function createTree() {
    const keypair = loadWalletKey("CNFTvZm6BPd5ZH2Lbn3mMnSsUYWirqjvRWo9wbcbfAB2.json");
    const connection = new Connection("https://api.devnet.solana.com");
    const merkleTree = loadWalletKey("TREyXNrxJSgrsWoYKU5xo8XYNCBNoZnSBdP5PkC1W2B.json")

    const [treeAuthority,
        _bump] = PublicKey.findProgramAddressSync(
        [merkleTree.publicKey.toBuffer() ],
        BUBBLEGUM_PROGRAM_ID,
        );

        const depthSizePair: ValidDepthSizePair = {
            maxDepth: 14,
            maxBufferSize: 64
        }
    createCreateTreeInstruction({
        merkleTree: merkleTree.publicKey,
        treeAuthority: treeAuthority,
        payer: keypair.publicKey,
        treeCreator: keypair.publicKey,
        compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
        logWrapper: SPL_NOOP_PROGRAM_ID,
        systemProgram: SYSTEM_PROGRAM_ID
    }, {
        maxDepth: depthSizePair.maxDepth,
        maxBufferSize: depthSizePair.maxBufferSize,
        public: false
    }
    );
    
    const sx = await sendVersionedTx(connection, [ix], keypair.publicKey, [keypair, merkleTree])
    console.log(sx);
}

createTree();