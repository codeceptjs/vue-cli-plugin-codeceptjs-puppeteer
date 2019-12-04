jest.setTimeout(process.env.APPVEYOR ? 120000 : 60000)

const create = require('@vue/cli-test-utils/createTestProject')

test('should work', async () => {
  const project = await create('e2e-codeceptjs', {
    plugins: {
      'vue-cli-plugin-e2e-codeceptjs': {},
    }
  })

  if (!process.env.CI) {
    await project.run(`vue-cli-service test:e2e`)
  } else if (!process.env.APPVEYOR) {
    await project.run(`vue-cli-service test:e2e --headless`)
  }
})
