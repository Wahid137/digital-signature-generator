async function generateKeys() {
    const keyPair = await window.crypto.subtle.generateKey(
        {
            name: "RSASSA-PKCS1-v1_5",
            modulusLength: 2048,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: "SHA-256",
        },
        true,
        ["sign", "verify"]
    );

    const exportedPublicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);

    document.getElementById("publicKeyDisplay").textContent = new TextDecoder().decode(exportedPublicKey);
    window.publicKey = keyPair.publicKey;
    window.privateKey = keyPair.privateKey;
}

async function signMessage() {
    const message = document.getElementById("message").value;
    const encoder = new TextEncoder();
    const data = encoder.encode(message);

    const signature = await window.crypto.subtle.sign(
        { name: "RSASSA-PKCS1-v1_5" },
        window.privateKey,
        data
    );

    const signatureHex = [...new Uint8Array(signature)]
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    document.getElementById("signatureDisplay").textContent = signatureHex;
    window.signature = signature;
}

async function verifySignature() {
    const message = document.getElementById("message").value;
    const encoder = new TextEncoder();
    const data = encoder.encode(message);

    const isValid = await window.crypto.subtle.verify(
        { name: "RSASSA-PKCS1-v1_5" },
        window.publicKey,
        window.signature,
        data
    );

    const verificationResult = isValid ? "Valid signature." : "Invalid signature.";
    document.getElementById("verificationResult").textContent = verificationResult;
}
