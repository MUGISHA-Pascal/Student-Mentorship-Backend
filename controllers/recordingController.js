import AWS from 'aws-sdk';

export const startRecording = (req, res) => {
    const { sessionId, stream } = req.body;
    try {
        const s3 = new AWS.S3();
        const params = {
            Bucket: 'your-s3-bucket',
            Key: `recordings/${sessionId}_${Date.now()}.webm`,
            Body: stream,
            ContentType: 'video/webm',
        };

        s3.upload(params, (err, data) => {
            if (err) return res.status(500).json({ message: 'Error uploading to S3' });
            res.status(200).json({ message: 'Recording started and uploaded', videoUrl: data.Location });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error starting recording' });
    }
};

export const stopRecording = (req, res) => {
    // Logic to stop recording and finalize the file
    res.status(200).json({ message: 'Recording stopped and saved' });
};
