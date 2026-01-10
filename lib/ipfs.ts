export const PINATA_API_URL = "https://api.pinata.cloud"

export async function uploadFileToIPFS(file: File): Promise<string> {
    const jwt = process.env.NEXT_PUBLIC_PINATA_JWT
    if (!jwt) {
        throw new Error("NEXT_PUBLIC_PINATA_JWT is not set")
    }

    const formData = new FormData()
    formData.append("file", file)

    const metadata = JSON.stringify({
        name: file.name,
    })
    formData.append("pinataMetadata", metadata)

    const options = JSON.stringify({
        cidVersion: 1,
    })
    formData.append("pinataOptions", options)

    const res = await fetch(`${PINATA_API_URL}/pinning/pinFileToIPFS`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${jwt}`,
        },
        body: formData,
    })

    if (!res.ok) {
        throw new Error(`Failed to upload file: ${res.statusText}`)
    }

    const data = await res.json()
    return data.IpfsHash
}

export async function uploadJSONToIPFS(json: any): Promise<string> {
    const jwt = process.env.NEXT_PUBLIC_PINATA_JWT
    if (!jwt) {
        throw new Error("NEXT_PUBLIC_PINATA_JWT is not set")
    }

    const res = await fetch(`${PINATA_API_URL}/pinning/pinJSONToIPFS`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
            pinataContent: json,
            pinataOptions: {
                cidVersion: 1,
            },
        }),
    })

    if (!res.ok) {
        throw new Error(`Failed to upload JSON: ${res.statusText}`)
    }

    const data = await res.json()
    return data.IpfsHash
}
