import { History } from "./history"
import { Settings } from "./settings"

/**
 * A unified facade for all user customization preferences.
 */
export class CustomizationFacade {
  public readonly history = History.fromLocalStorage()

  public readonly settings = Settings.fromLocalStorage()
}

/**
 * The singleton instance of CustomizationFacade.
 *
 * @see {@link CustomizationFacade}
 */
export const customizationFacade = new CustomizationFacade()
