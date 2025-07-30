const express = require('express');
const multer = require('multer');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();

const PORT = 4000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

app.post('/api/render', upload.fields([
  { name: 'videos', maxCount: 10 },
  { name: 'audios', maxCount: 10 },
]), async (req, res) => {
  try {
   const videoFiles = req.files['videos'].map(file => `/public/${file.filename}`);
    const audioFiles = req.files['audios']? req.files['audios'].map(file => `/public/${file.filename}`): [];


    const outName = `out-${Date.now()}.mp4`;
    const outPath = path.join(__dirname, `../public/${outName}`);

    const props = {
      videoSources: videoFiles,
      audioSources: audioFiles,
    };

    const propsPath = path.join(__dirname, `../public/props-${Date.now()}.json`);
    fs.writeFileSync(propsPath, JSON.stringify(props));

    const cmd = `npx remotion render src/index.ts MyComposition "${outPath}" --props="${propsPath}"`;
    console.log('Running:', cmd);

    exec(cmd, (err, stdout, stderr) => {
        if (err) {
            console.error('Render error:', stderr);
            return res.status(500).json({ error: 'Render failed', details: stderr });
        }

        // Xoá props sau khi render
        fs.unlinkSync(propsPath);

        // Trả file về dưới dạng stream
        res.setHeader('Content-Type', 'video/mp4');
        res.setHeader('Content-Disposition', `attachment; filename="${outName}"`);

        const fileStream = fs.createReadStream(outPath);
        fileStream.pipe(res);

        fileStream.on('end', () => {
            // Tuỳ chọn: xoá file sau khi gửi xong
            // fs.unlinkSync(outPath);
        });

        fileStream.on('error', (streamErr) => {
            console.error('Streaming error:', streamErr);
            res.status(500).send('Error streaming video.');
        });
    });


  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

app.use('/public', express.static(path.join(__dirname, '../public')));

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
