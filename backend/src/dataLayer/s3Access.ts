import * as AWS from 'aws-sdk'

export class S3Access {

    constructor(
        private readonly s3 = new AWS.S3({signatureVersion: 'v4'}),
        private readonly bucketName = process.env.TODOS_S3_BUCKET,
        private readonly urlExpiration = process.env.TODOS_S3_EXPIRATION || 300
    )
    { }
        
    async getUploadUrl(todoId: string) {
        try {
            console.log("Getting singed url for todoId:" + todoId)

            const signedURL = this.s3.getSignedUrl('putObject', {
                Bucket: this.bucketName,
                Key: todoId,
                Expires: this.urlExpiration
            })
                
            return signedURL

        } catch (error) {
            console.log("An error happened while getting S3 signedUrl:", error)
            return "ERROR"
        }
    }
    

}