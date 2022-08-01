import React from "react";
import Card from "./Card";
import StoreIcon from '@mui/icons-material/Store';
import AddBoxIcon from '@mui/icons-material/AddBox';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

import "./infoCards.css";

export default function InfoCards() {
  return (
    <div className="cards">
      <Card
        icon= {StoreIcon}
        title="Purchase Tokens"
        text="Purchase the correct tokens for the desired node using BogSwap or TraderJoe. Costs may vary depending on token prices"
      />

      <Card
        icon= {AddBoxIcon}
        title="Create Nodes"
        text="Create the node using your tokens. Each node will automatically enter the weekly contest"
      />

      <Card
        icon= {EmojiEventsIcon}
        title="Track Stats"
        text="Each FUDGE node will earn 1 point and LP nodes will earn 10 points. Points reset every Sunday at 12 PM Eastern. For prizes please refer to our Discord."
      />
    </div>
  );
}