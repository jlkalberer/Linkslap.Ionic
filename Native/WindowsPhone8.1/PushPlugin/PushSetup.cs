namespace PushPlugin
{
    using System;
    using System.Linq;

    using Windows.ApplicationModel.Background;
    using Windows.Foundation;
    using Windows.Networking.PushNotifications;

    public sealed class PushSetup
    {
        public static IAsyncOperation<PushNotificationChannel> Run()
        {
            const string PushNotificationTaskName = "ToastNotifications";

            var ns = new NotificationStore();
            var channelTask = ns.Register();

            if (GetRegisteredTask(PushNotificationTaskName) != null)
            {
                return channelTask.AsAsyncOperation();
            }


            ObtainLockScreenAccess();
            
            var taskBuilder = new BackgroundTaskBuilder
            {
                Name = PushNotificationTaskName,
                TaskEntryPoint = typeof(PushBackgroundTask).FullName
            };

            var trigger = new PushNotificationTrigger();
            taskBuilder.SetTrigger(trigger);

            var internetCondition = new SystemCondition(SystemConditionType.InternetAvailable);
            taskBuilder.AddCondition(internetCondition);

            try
            {
                taskBuilder.Register();
            }
            catch (Exception exception)
            {
            }

            return channelTask.AsAsyncOperation();
        }


        /// <summary>
        /// The obtain lock screen access.
        /// </summary>
        private static async void ObtainLockScreenAccess()
        {
            BackgroundAccessStatus status = await BackgroundExecutionManager.RequestAccessAsync();

            if (status == BackgroundAccessStatus.Denied || status == BackgroundAccessStatus.Unspecified)
            {
                return;
            }
        }


        /// <summary>
        /// The get registered task.
        /// </summary>
        /// <param name="taskName">
        /// The task Name.
        /// </param>
        /// <returns>
        /// The <see cref="IBackgroundTaskRegistration"/>.
        /// </returns>
        private static IBackgroundTaskRegistration GetRegisteredTask(string taskName)
        {
            return BackgroundTaskRegistration.AllTasks.Values.FirstOrDefault(task => task.Name == taskName);
        }
    }
}
