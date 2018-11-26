const fs = require('fs')
const path = require('path')
const program = require('commander')
const generator = require('./src/generator')

program
  .version('1.0.0')
  .description('Generates LQ image thumbs (used for LQIP)')

program
  .command('generate <fileOrFolder> [destination]')
  .alias('gen')
  .description('Generate a LQ file (if a file was passed in or multiple files if a folder was given).')
  .description('By default generates files in the same folder as the given folder. Can generate into a custom folder, if you pass it as the second parameter.')
  .action((fileOrFolder, destination) => {
    let input = null
    try {
      input = fs.lstatSync(fileOrFolder)
    } catch (ex) {
      console.error(ex)
      process.exit(1)
    }
    if (input.isDirectory()) {
      const folder = fileOrFolder
      fs.readdir(folder, function(err, items) {
        for (var i=0; i<items.length; ++i) {
          try {
            let file = path.resolve(path.join(folder, items[i]))
            const itemCheck = fs.lstatSync(file)
            if (!itemCheck.isFile()) continue
            generator.generate(file, destination).then(result => {
              console.log(result)
            }).catch(err => {
              console.error(err)
            })
          } catch (ex) {
            console.error(ex)
            process.exit(1)
          }
        }
      })
    } else if (input.isFile()) {
      const file = path.resolve(fileOrFolder)
      generator.generate(file, destination).then(result => {
        console.log(result)
      })
    } else {
      console.error('Invalid file or folder given!')
      process.exit(1)
    }
  })

program.parse(process.argv)
