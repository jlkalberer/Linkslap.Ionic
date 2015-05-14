using System;

namespace PushPlugin
{
    using Newtonsoft.Json;

    internal sealed class Link
    {
        /// <summary>
        /// Gets or sets the feed name.
        /// </summary>
        [JsonProperty("streamName")]
        public string StreamName { get; set; }

        /// <summary>
        /// Gets or sets the feed.
        /// </summary>
        [JsonProperty("streamKey")]
        public string StreamKey { get; set; }

        /// <summary>
        /// Gets or sets the link id.
        /// </summary>
        [JsonProperty("id")]
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the url.
        /// </summary>
        [JsonProperty("url")]
        public string Url { get; set; }

        /// <summary>
        /// Gets or sets the comment.
        /// </summary>
        [JsonProperty("comment")]
        public string Comment { get; set; }

        /// <summary>
        /// Gets or sets the created date.
        /// </summary>
        [JsonProperty("createdDate")]
        public DateTime CreatedDate { get; set; }

        /// <summary>
        /// Gets or sets the user name.
        /// </summary>
        [JsonProperty("userName")]
        public string UserName { get; set; }
    }
}
