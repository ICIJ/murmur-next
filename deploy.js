import gh from 'gh-pages'
import path from 'path'
import ora from 'ora'
import chalk from 'chalk'

process.env.NODE_ENV = 'production'

const spinner = ora('push dist folder to gh-pages branch...')
const message = 'Updates [ci skip]'
spinner.start()

gh.publish(path.join(process.cwd(), 'dist', 'docs'), { message }, () => {
  spinner.stop()
  console.log(chalk.cyan('  Push complete.\n'))
})
