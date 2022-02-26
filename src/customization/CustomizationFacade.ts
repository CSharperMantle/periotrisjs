import { History } from "./history"
import { Settings } from "./settings"

class CustomizationFacade {
  public readonly history = History.fromLocalStorage()

  public readonly settings = Settings.fromLocalStorage()
}

export { CustomizationFacade }
