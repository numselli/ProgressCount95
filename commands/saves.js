const { SlashCommandBuilder } = require('@discordjs/builders');
const {MessageEmbed, Permissions} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('saves')
        .setDescription(`save cmd`)
        .addSubcommand(subcommand => subcommand
			.setName("claim")
			.setDescription("Claim your saves!"))
        .addSubcommand(subcommand => subcommand
			.setName("view")
			.setDescription("View your saves!")),
    async execute(interaction) {
        const db = interaction.client.db.Counters;
        const subcommand = interaction.options.getSubcommand();
        let save = await db.findOne({ where: { userID: interaction.user.id } });
        
        if (subcommand === "claim") {
            let [row,] = await db.findOrCreate({ where: { userID: interaction.user.id }, defaults: { saves: 2, slots: 5 } })
            let embed = new MessageEmbed().setTitle("Saves").setColor("#0099ff").setTimestamp()
            row.increment('saves', { by: 0.5 });
            if ((new Date().now - new Date(row.saveCooldown)) > 60*60*1000*12 ) { console.log("can claim!")}
            `You have claimed **0.5** saves!\nYou now have **${row.get('saves')+0.5}** saves!`
            return interaction.reply({embeds: [embed]});

        } else if (subcommand === "view") {
            const row = await db.findOne({ where: { userID: interaction.user.id }})
            if (row) {
                const embed = new MessageEmbed()
                    .setTitle(`Saves`)
                    .setColor("#0099ff")
                    .setDescription(`You have **${row.get('saves')}** saves`)
                    .setTimestamp()
                return interaction.reply({embeds: [embed]});
            } else {
                const embed = new MessageEmbed()
                    .setTitle(`Saves`)
                    .setColor("#0099ff")
                    .setDescription(`**You have not claimed any saves! Use \`/saves claim\`!**`)
                    .setTimestamp()
                return interaction.reply({embeds: [embed]});
            }
        }
    },
};