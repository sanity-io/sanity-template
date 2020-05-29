const {Validator} = require('jsonschema')
const path = require('path')

const validator = new Validator()
const v0schema = {
  type: 'object',
  properties: {
    version: {type: 'integer'},
    title: {type: 'string'},
    description: {type: 'string'},
    dataArchive: {type: 'string'},
    paths: {$ref: '#/definitions/paths'},
    deployments: {type: 'array', items: {$ref: '#/definitions/deploymentDeclaration'}},
    previewMedia: {$ref: '#/definitions/media'},
    technologies: {type: 'array', items: {$ref: '#/definitions/technology'}}
  },
  required: ['version', 'title', 'description', 'deployments', 'previewMedia'],
  additionalProperties: false,
  definitions: {
    paths: {
      type: 'object',
      properties: {
        template: {type: 'string'},
        build: {type: 'string'}
      },
      additionalProperties: false
    },
    deploymentDeclaration: {
      type: 'object',
      properties: {
        id: {type: 'string'},
        type: {type: 'string', enum: ['studio', 'web']},
        title: {type: 'string'},
        description: {type: 'string'},
        dir: {type: 'string'},
        provider: {$ref: '#/definitions/deploymentProvider'},
        previewMedia: {$ref: '#/definitions/media'},
        requiredCorsOrigins: {
          type: 'array',
          items: {$ref: '#/definitions/sanityCorsOriginDeclaration'}
        },
        requiredTokens: {type: 'array', items: {$ref: '#/definitions/sanityTokenDeclaration'}}
      },
      required: ['id', 'type', 'title', 'description', 'dir', 'provider'],
      additionalProperties: false
    },
    deploymentProvider: {
      type: 'object',
      properties: {
        name: {type: 'string', enum: ['netlify']},
        config: {
          type: 'object',
          properties: {
            base: {type: 'string'},
            dir: {type: 'string'},
            cmd: {type: 'string'}
          }
        }
      },
      required: ['name'],
      additionalProperties: false
    },
    media: {
      type: 'object',
      properties: {
        type: {type: 'string', enum: ['image']},
        src: {type: 'string'},
        alt: {type: 'string'}
      },
      required: ['type', 'src', 'alt'],
      additionalProperties: false
    },
    sanityCorsOriginDeclaration: {
      type: 'object',
      properties: {
        origin: {type: 'string'},
        allowCredentials: {type: 'boolean'}
      },
      required: ['origin', 'allowCredentials'],
      additionalProperties: false
    },
    sanityTokenDeclaration: {
      type: 'object',
      properties: {
        role: {type: 'string', enum: ['deploy-studio', 'read', 'write']},
        label: {type: 'string'}
      },
      required: ['role', 'label'],
      additionalProperties: false
    },
    technology: {
      type: 'object',
      properties: {
        id: {type: 'string'},
        name: {type: 'string'},
        url: {type: 'string'}
      },
      required: ['id', 'name', 'url'],
      additionalProperties: false
    }
  }
}

async function validateV0({manifest}) {
  const result = validator.validate(manifest, v0schema)
  const isSuccess = result.errors.length === 0

  return {
    errors: result.errors,
    isSuccess
  }
}

async function check({basedir}) {
  if (!basedir) throw new Error('missing basedir')

  let manifest

  try {
    manifest = require(path.resolve(basedir, 'sanity-template.json'))
  } catch (requireErr) {
    throw new Error('missing file: sanity-template.json')
  }

  switch (manifest.version) {
    case 0:
      return validateV0({basedir, manifest})
    default:
      const versionError = new Error(`invalid version: ${manifest.version} (expected 0)`)
      return {
        errors: [versionError],
        isSuccess: false
      }
  }
}

module.exports = check
