namespace PushPlugin
{
    using Newtonsoft.Json;

    /// <summary>
    /// The subscription.
    /// </summary>
    internal class Subscription
    {
        /// <summary>
        /// Gets or sets the id.
        /// </summary>
        [JsonProperty("id")]
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the feed.
        /// </summary>
        [JsonProperty("stream")]
        public virtual Stream Stream { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether administer.
        /// </summary>
        [JsonProperty("administrate")]
        public bool Administrate { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether read.
        /// </summary>
        [JsonProperty("read")]
        public bool Read { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether write.
        /// </summary>
        [JsonProperty("write")]
        public bool Write { get; set; }
    }
}
