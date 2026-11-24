/**
 * Caribooks plugin: registers Caribooks' hosted MCP server with the Harness's
 * shared MCP manager for this plugin's lifetime, tells the model what its tools
 * are, and shows the Caribooks account on the Plugins page. The manager owns
 * the connection, the OAuth sign-in, the saved grant and sign-out; once a grant
 * exists, the `mcp__caribooks__*` tools are listed and each agent loads the
 * ones it needs.
 */

export const name = 'caribooks'
export const inject = ['mcpManager', 'systemPrompt']

// A fixed server name keeps tool names stable, and a fixed credential key lets
// a reinstalled plugin reuse its saved grant.
const SERVER_NAME = 'caribooks'
const CREDENTIAL_KEY = 'mcp-client/caribooks'
const SERVER_URL = 'https://caribooks.com/api/mcp'
const GUIDANCE = 'Tools named `mcp__caribooks__*` come from the Caribooks plugin, which reads and updates the user\'s QuickBooks Online books.'
  + ' In user-facing replies, call it Caribooks, not MCP.'
  + ' If no `mcp__caribooks__*` tool appears in your tool list, Caribooks is not connected yet; ask the user to connect it on the Caribooks plugin page in Plugins.'

// The Plugins page asks for every language the Harness ships; the languages
// Caribooks does not write fall back to English.
const text = (en, fr) => ({ zh: en, en, ja: en, es: en, fr, de: en, ru: en, pt: en })

const COPY = {
  title: text('Caribooks account', 'Compte Caribooks'),
  connect: text('Connect Caribooks', 'Connecter Caribooks'),
  activation: {
    title: text('Connect your Caribooks account', 'Connectez votre compte Caribooks'),
    body: text(
      'The Caribooks plugin is on. Connect your Caribooks account to use your QuickBooks books in conversations.',
      'Le plugin Caribooks est activé. Connectez votre compte Caribooks pour utiliser vos livres QuickBooks dans vos conversations.',
    ),
  },
  detail: {
    disconnected: text(
      'Connect your Caribooks account to ask about your QuickBooks books and update them from a conversation.',
      'Connectez votre compte Caribooks pour interroger vos livres QuickBooks et les mettre à jour depuis une conversation.',
    ),
    waitingBrowser: text(
      'The Caribooks authorization page is open. Sign in, click Allow, then come back here.',
      'La page d’autorisation de Caribooks est ouverte. Connectez-vous, cliquez sur Autoriser, puis revenez ici.',
    ),
    authorizing: text('Finishing authorization with Caribooks.', 'Finalisation de l’autorisation avec Caribooks.'),
    connecting: text('Connecting to Caribooks.', 'Connexion à Caribooks en cours.'),
    connected: text(
      'Ask the agent about your QuickBooks books in a conversation.',
      'Posez vos questions sur vos livres QuickBooks à l’agent, dans une conversation.',
    ),
    rejected: text(
      'Caribooks no longer accepts the current authorization. Connect again.',
      'Caribooks n’accepte plus l’autorisation actuelle. Connectez-vous de nouveau.',
    ),
    scope: text(
      'The current authorization lacks required permissions. Connect again.',
      'Il manque des permissions à l’autorisation actuelle. Connectez-vous de nouveau.',
    ),
  },
  signOut: {
    title: text('Sign out of Caribooks?', 'Se déconnecter de Caribooks ?'),
    body: text(
      'This deletes the Caribooks authorization DeepSeek Harness saved, so conversations can no longer use Caribooks.',
      'Cela supprime l’autorisation Caribooks enregistrée par DeepSeek Harness : vos conversations ne pourront plus utiliser Caribooks.',
    ),
  },
  notice: {
    connected: text('Caribooks connected', 'Caribooks connecté'),
    signedOut: text('Signed out of Caribooks', 'Déconnecté de Caribooks'),
  },
}

/**
 * Register the Caribooks server, its guidance for the model and, while the
 * account registry runs, its Plugins page account; all are withdrawn when the
 * plugin unloads.
 * @param ctx - Context carrying the MCP manager and system prompt.
 */
export function apply(ctx) {
  ctx.mcpManager.register(SERVER_NAME, {
    transport: 'streamable-http',
    url: SERVER_URL,
    oauth: { credentialKey: CREDENTIAL_KEY },
    toolLoading: 'on-demand',
  })
  ctx.systemPrompt.section({
    name: SERVER_NAME,
    order: ctx.systemPrompt.getSectionOrder('MCP_SERVERS'),
    text: GUIDANCE,
  })
  ctx.inject(['mcpAccounts'], (scope) => {
    scope.effect(
      () => scope.mcpAccounts.register({ server: SERVER_NAME, packageName: 'dsh-caribooks', copy: COPY }),
      'caribooks: Plugins page account',
    )
  })
}
