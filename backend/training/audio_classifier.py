import torch
import torch.nn as nn

class TransformerClassifier(nn.Module):
    def __init__(self, input_dim=768, num_classes=6, num_layers=4, num_heads=8, hidden_dim=512):
        super().__init__()
        encoder_layer = nn.TransformerEncoderLayer(
            d_model=input_dim, 
            nhead=num_heads, 
            dim_feedforward=hidden_dim, 
            batch_first=True, 
            activation='gelu',
            dropout=0.1
        )
        self.transformer = nn.TransformerEncoder(encoder_layer, num_layers=num_layers)

        self.norm = nn.LayerNorm(input_dim * 2)
        self.classifier = nn.Sequential(
            nn.Linear(input_dim * 2, 128),
            nn.ReLU(),
            nn.Dropout(0.4),
            nn.Linear(128, num_classes)
        )

    def forward(self, x, lengths):
        # vector shape: (B, T, D)
        mask = torch.arange(x.size(1), device=x.device)[None, :] >= lengths[:, None]
        x = self.transformer(x, src_key_padding_mask=mask)
        pooled_mean = x.mean(dim=1) # Single Vector representing the average Emotional Signal Across Time
        pooled_max = x.max(dim=1).values # Single Vector representing the strongest Emotional Signal Across Time (ex: Scream for 0.3s)
        pooled = self.norm(torch.cat([pooled_mean, pooled_max], dim=1)) # Normalizes and joins two vectors for richer summary, (Average Tone, Peak Intensity)
        return self.classifier(pooled)