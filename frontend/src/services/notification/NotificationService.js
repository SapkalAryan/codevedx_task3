import { toast } from "react-toastify";
import messages from "./notificationMessages";

class NotificationService {
  success(message) {
    toast.success(message);
  }

  info(message) {
    toast.info(message);
  }

  warning(message) {
    toast.warning(message);
  }

  error(message) {
    toast.error(message);
  }

  watchlistAdded(title) {
    this.success(messages.watchlistAdded(title));
  }

  watchlistRemoved(title) {
    this.info(messages.watchlistRemoved(title));
  }

  watchedAdded(title) {
    this.success(messages.watchedAdded(title));
  }

  watchedRemoved(title) {
    this.info(messages.watchedRemoved(title));
  }

  removedFromWatchlist() {
    this.info(messages.removedFromWatchlist);
  }

  networkError() {
    this.error(messages.networkError);
  }

  loginRequired() {
    this.warning(messages.loginRequired);
  }

  sessionExpired() {
    this.warning(messages.sessionExpired);
  }

  unknownError() {
    this.error(messages.unknownError);
  }
}

export default new NotificationService();