const jsonServer = require('json-server')
const path = require('path')
const fs = require('fs')

// Sur Azure, /home est persistant et inscriptible : on y garde la base
// pour qu'elle ne soit pas écrasée à chaque déploiement.
const dataDir = process.env.WEBSITE_SITE_NAME ? '/home/data' : __dirname
const dbFile = path.join(dataDir, 'db.json')
if (!fs.existsSync(dbFile)) {
  fs.mkdirSync(dataDir, { recursive: true })
  fs.copyFileSync(path.join(__dirname, 'db.json'), dbFile)
}

const distDir = path.join(__dirname, 'dist')
const server = jsonServer.create()

server.use(jsonServer.defaults({ static: distDir }))
server.use('/api', jsonServer.router(dbFile))

// vue-router en mode history : toutes les autres routes renvoient index.html
server.get('*', (req, res) => res.sendFile(path.join(distDir, 'index.html')))

const port = process.env.PORT || 3000
server.listen(port, () => console.log(`Serveur démarré sur le port ${port}`))
