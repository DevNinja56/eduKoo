import { UNLOCK_ERROR } from './monetization.constants';

function monetizationServiceFactory(transactionsService, paidFeaturesService) {
  class MonetizationService {
    async tryUnlockFeature(featureKey, force = false) {
      const isPossibleToUnlock = await paidFeaturesService.isFeatureUnlockPossible(
        featureKey,
      );

      if (force || isPossibleToUnlock) {
        await unlockPaidFeature(featureKey);
      } else {
        throw new Error(UNLOCK_ERROR);
      }
    }
  }

  return new MonetizationService();

  async function unlockPaidFeature(featureKey) {
    const feature = paidFeaturesService.getFeature(featureKey);

    await transactionsService.sendSpending(feature.cost);
  }
}

export default monetizationServiceFactory;
