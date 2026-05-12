import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import * as io from '@actions/io'
import * as os from 'os'
import * as path from 'path'

// Constants
const MAVEN_BASE = 'https://dl.google.com/dl/android/maven2/com/android/tools/build/aapt2'

// Maps the runner OS to the Maven classifier used in the JAR filename.
function getPlatformClassifier(): string {
  const platform = os.platform()
  if (platform === 'win32') return 'windows'
  if (platform === 'darwin') return 'osx'
  if (platform === 'linux') return 'linux'
  throw new Error(`Unsupported platform: ${platform}`)
}

// Fetches the latest stable version from Maven metadata
async function getLatestStableVersion(): Promise<string> {
  const metadataUrl = `${MAVEN_BASE}/maven-metadata.xml`
  const metadataPath = await tc.downloadTool(metadataUrl)
  const fs = await import('fs/promises')
  const metadataContent = await fs.readFile(metadataPath, 'utf-8')

  // Parse versions from XML: <version>X.Y.Z-XXXXXXXX</version>
  const versionRegex = /<version>([\d.]+(?:-\d+)?)<\/version>/g
  const versions: string[] = []
  let match

  while ((match = versionRegex.exec(metadataContent)) !== null) {
    versions.push(match[1])
  }

  if (versions.length === 0) {
    throw new Error('No versions found in Maven metadata')
  }

  // Filter out prerelease versions (alpha, beta, rc, etc.)
  // and return the latest one
  const stableVersions = versions.filter(
    v => !/-(alpha|beta|rc|dev)\d*/i.test(v)
  )

  if (stableVersions.length === 0) {
    throw new Error('No stable versions found in Maven metadata')
  }

  // Return the last version (Maven lists them in ascending order)
  return stableVersions[stableVersions.length - 1]
}

// Main function
async function run(): Promise<void> {
  try {
    let version = core.getInput('version')

    // Fetch latest stable version if not specified
    if (!version) {
      core.info('Fetching latest stable version from Maven…')
      version = await getLatestStableVersion()
      core.info(`Using latest stable version: ${version}`)
    }

    const classifier = getPlatformClassifier()

    // Build the download URL
    const jarName = `aapt2-${version}-${classifier}.jar`
    const downloadUrl = `${MAVEN_BASE}/${version}/${jarName}`

    core.info(`Downloading AAPT2 ${version} for ${classifier}…`)
    core.info(`URL: ${downloadUrl}`)

    // Download the JAR
    const jarPath = await tc.downloadTool(downloadUrl)

    // Extract the JAR
    const installDir = path.join(os.homedir(), 'aapt2', version)
    await io.mkdirP(installDir)

    core.info(`Extracting to ${installDir}…`)
    await tc.extractZip(jarPath, installDir)

    // Make executable on Unix
    if (os.platform() !== 'win32') {
      const { chmod } = await import('fs/promises')
      await chmod(path.join(installDir, 'aapt2'), 0o755)
    }

    // Add the install dir to PATH
    core.addPath(installDir)

    core.info(`✅ AAPT2 ${version} installed and added to PATH.`)
  } catch (error) {
    core.setFailed((error as Error).message)
  }
}

run()