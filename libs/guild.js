const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(`MongoDB connection error: ${err}`));

const GuildSchema = new Schema({
  guildID: { type: String, required: true },
  counting: {
    enabled: { type: Boolean, default: false },
    channel: { type: String },
    count: { type: Number, default: 0 }
  },
  buttonRoles: {
    enabled: { type: Boolean, default: false },
    channel: { type: String },
    roles: { type: Map, of: String }
  },
  welcome: {
    enabled: { type: Boolean, default: false },
    welcomeMessage: { type: String },
    leaveMessage: { type: String }
  },
  afk: {
    enabled: { type: Boolean, default: false },
    timeout: { type: Number, default: 0 }
  },
  movie: {
    enabled: { type: Boolean, default: false },
    channelID: { type: String },
    message: { type: String }
  },
  chatgpt: {
    enabled: { type: Boolean, default: false },
    temperature: { type: Number, default: 0.5 }
  }
});

const GuildModel = mongoose.model('Guild', GuildSchema);

module.exports = GuildModel;
