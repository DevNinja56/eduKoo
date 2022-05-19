import { PAID_FEATURES } from '../../features/monetization/constants';

function paidFeaturesServiceFactory(userService) {
  return {
    getFeature,
    isFeatureUnlockPossible,
  };

  function getFeature(featureKey) {
    if (typeof PAID_FEATURES[featureKey] !== 'object') {
      throw new Error(`No paid feature with key "${featureKey}"`);
    }

    return PAID_FEATURES[featureKey];
  }

  async function isFeatureUnlockPossible(featureKey) {
    const feature = getFeature(featureKey);
    const user = await userService.getUser();

    if (feature.subscriptionRequired && !user.hasSubscription) {
      return false;
    }

    return user.hasSubscription || user.diamondsAmount >= feature.cost;
  }
}

export default paidFeaturesServiceFactory;
