namespace PushPlugin
{
    using System;
    using System.Threading.Tasks;

    using Windows.Foundation;

    using Windows.Networking.PushNotifications;

    /// <summary>
    /// The notification store.
    /// </summary>
    internal sealed class NotificationStore
    {
        /// <summary>
        /// Gets the channel.
        /// </summary>
        public static PushNotificationChannel channel;

        /// <summary>
        /// The push notification received.
        /// </summary>
        public static event TypedEventHandler<PushNotificationChannel, PushNotificationReceivedEventArgs> PushNotificationReceived;

        private static void OnPushNotificationReceived(PushNotificationChannel sender, PushNotificationReceivedEventArgs args)
        {
            TypedEventHandler<PushNotificationChannel, PushNotificationReceivedEventArgs> handler =
                PushNotificationReceived;
            if (handler != null)
            {
                handler(sender, args);
            }
        }

        /// <summary>
        /// The register.
        /// </summary>
        public async Task<PushNotificationChannel> Register()
        {
            return await TryRegisterChannel();
        }

        /// <summary>
        /// The try register channel.
        /// </summary>
        /// <returns>
        /// The <see cref="Task"/>.
        /// </returns>
        private static async Task<PushNotificationChannel> TryRegisterChannel()
        {
            try
            {
                if (channel == null)
                {
                    channel = await PushNotificationChannelManager.CreatePushNotificationChannelForApplicationAsync();
                    channel.PushNotificationReceived += OnPushNotificationReceived;
                }
            }
            catch (Exception)
            {
                return null;
            }

            return channel;
        }
    }
}
