import { getConfig } from '../bootstrap';
import { GovernanceModule } from './governance';

// Add governance module.
let governanceModule: GovernanceModule;

export function useGovernance() {
  const config = getConfig();
  if (!config) throw new Error('No client available');
  if (!governanceModule) {
    governanceModule = new GovernanceModule(config.restUrl);
  }
  return governanceModule;
}
