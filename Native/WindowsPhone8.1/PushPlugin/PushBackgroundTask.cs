namespace PushPlugin
{
    using System;

    using Windows.ApplicationModel.Background;
    using Windows.Data.Xml.Dom;
    using Windows.Networking.PushNotifications;
    using Windows.UI.Notifications;
    using Windows.UI.Xaml.Controls;

    using Newtonsoft.Json;

    public sealed class PushBackgroundTask : IBackgroundTask
    {
        /// <summary>
        /// The run.
        /// </summary>
        /// <param name="taskInstance">
        /// The task instance.
        /// </param>
        public void Run(IBackgroundTaskInstance taskInstance)
        {
            var localSettings = Windows.Storage.ApplicationData.Current.LocalSettings;
            
            // Store the content received from the notification so it can be retrieved from the UI.
            var rawNotification = (RawNotification)taskInstance.TriggerDetails;


            if (rawNotification == null || string.IsNullOrEmpty(rawNotification.Content))
            {
                return;
            }

            this.Process(rawNotification.Content, true);
        }

        /// <summary>
        /// The process.
        /// </summary>
        /// <param name="content">
        /// The content.
        /// </param>
        /// <param name="showNotifications">
        /// The show notifications.
        /// </param>
        public void Process(string content, bool showNotifications)
        {
            dynamic jsonObject = JsonConvert.DeserializeObject(content);

            if (jsonObject.objectType == "submittedlink")
            {
                SendLinkNotification(content, showNotifications);
            }
            else if (jsonObject.objectType == "subscription")
            {
                this.AddSubscription(content);
            }
        }

        /// <summary>
        /// The send link notification.
        /// </summary>
        /// <param name="content">
        /// The content.
        /// </param>
        /// <param name="showNotifications">
        /// The show notifications.
        /// </param>
        /// <returns>
        /// The <see cref="bool"/>.
        /// </returns>
        private static bool SendLinkNotification(string content, bool showNotifications)
        {
            Link link;
            try
            {
                link = JsonConvert.DeserializeObject<Link>(content);
            }
            catch (Exception exception)
            {
                return false;
            }

            // Do not show notification if processing from inside the app.
            if (!showNotifications)
            {
                return true;
            }


            //var settings = new SettingsStore();
            //if (!settings.ShowPushNotification(link.StreamKey))
            //{
            //    return true;
            //}

            var notification = ToastNotificationManager.GetTemplateContent(ToastTemplateType.ToastImageAndText02);
            var toastElement = ((XmlElement)notification.SelectSingleNode("/toast"));
            toastElement.SetAttribute("launch", content);

            var badgeElements = notification.DocumentElement.SelectNodes(".//text");

            badgeElements[0].InnerText = "Linkslap";
            badgeElements[1].InnerText = "New link in " + link.StreamName;

            dynamic toast = new ToastNotification(notification); //{ Tag = link.Id.ToString() };
            toast.Tag = link.Id.ToString();

            ToastNotificationManager.CreateToastNotifier().Show(toast);

            return true;
        }

        /// <summary>
        /// The add subscription.
        /// </summary>
        /// <param name="content">
        /// The content.
        /// </param>
        /// <returns>
        /// The <see cref="bool"/>.
        /// </returns>
        private bool AddSubscription(string content)
        {
            Subscription subscription;
            try
            {
                subscription = JsonConvert.DeserializeObject<Subscription>(content);
            }
            catch (Exception exception)
            {
                return false;
            }

            // TODO - Store in local storage instead of just telling the streams to reload
            Windows.Storage.ApplicationData.Current.LocalSettings.Values["NewStream"] = true;

            return true;
        }
    }
}
